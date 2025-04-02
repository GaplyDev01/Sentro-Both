const { supabase } = require('../config/db.config');
const bcrypt = require('bcryptjs');

/**
 * User model for Supabase
 */
class User {
  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "not found" error code
    return data;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Insert user into the database
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        business_industry: userData.businessDetails?.industry || null,
        business_location: userData.businessDetails?.location || null,
        setup_completed: userData.setupCompleted || false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.formatUser(data);
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  static async update(id, userData) {
    const updateData = {
      updated_at: new Date(),
    };

    // Only include fields that are provided
    if (userData.firstName) updateData.first_name = userData.firstName;
    if (userData.lastName) updateData.last_name = userData.lastName;
    if (userData.businessDetails?.industry) updateData.business_industry = userData.businessDetails.industry;
    if (userData.businessDetails?.location) updateData.business_location = userData.businessDetails.location;
    if (userData.setupCompleted !== undefined) updateData.setup_completed = userData.setupCompleted;

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(userData.password, salt);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.formatUser(data);
  }

  /**
   * Verify password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} Whether password matches
   */
  static async matchPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Format user object to standard format
   * @param {Object} dbUser - Database user object
   * @returns {Object} Formatted user object
   */
  static formatUser(dbUser) {
    if (!dbUser) return null;
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      businessDetails: {
        industry: dbUser.business_industry,
        location: dbUser.business_location,
      },
      setupCompleted: dbUser.setup_completed,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      // Don't include password
    };
  }
}

module.exports = User; 