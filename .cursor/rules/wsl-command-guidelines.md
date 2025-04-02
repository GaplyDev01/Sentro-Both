# WSL Command Guidelines

This project uses Ubuntu WSL for terminal commands while running on Windows 11. Follow these guidelines for all terminal operations.

## Path Conversions

### Windows to WSL Path Conversion
- Windows C: drive is accessible as `/mnt/c/` in WSL
- Windows path: `C:\Users\username\project` → WSL path: `/mnt/c/Users/username/project`
- Use forward slashes (`/`) for all paths in WSL commands
- Escape spaces in paths with backslashes or quotes: `/mnt/c/Program\ Files/` or `"/mnt/c/Program Files/"`

### WSL to Windows Path Conversion
- When a Windows application needs a path from WSL, convert back to Windows format
- WSL path: `/mnt/c/Users/username/project` → Windows path: `C:\Users\username\project`

## Terminal Commands

### File Operations
- Use Linux commands: `cp`, `mv`, `rm`, `mkdir`, `touch`, etc.
- Example: `mkdir -p /mnt/c/Users/username/project/src/components`

### Directory Navigation
- Use `cd`, `pushd`, `popd` for navigation
- Use Linux path conventions: `cd /mnt/c/Users/username/project`

### File Permissions
- Remember that WSL and Windows have different permission systems
- Use `chmod` and `chown` only for files within the WSL filesystem
- Windows permissions must be managed through Windows commands or GUI

### Package Management
- Use `apt` for Ubuntu package management: `sudo apt update && sudo apt install package-name`
- Use language-specific package managers as needed: `npm`, `pip`, `gem`, etc.

### Running Applications
- To run Windows executables from WSL: `/mnt/c/Program\ Files/App/app.exe`
- To run WSL applications that open Windows applications: `explorer.exe .`

## Development Tools

### Git Operations
- Use Git within WSL for consistent line endings: `git config --global core.autocrlf input`
- Standard git commands work as expected: `git clone`, `git pull`, `git push`, etc.

### Build Tools
- Use WSL native build tools when possible: `make`, `gcc`, `g++`, etc.
- For Node.js development: use `npm` or `yarn` within WSL
- For Python development: use `pip` within WSL

### Docker
- If using Docker, prefer Docker Desktop with WSL 2 backend
- Docker commands can be run directly from WSL terminal

## Best Practices

### Performance
- Store code within the WSL filesystem for best performance with Linux tools
- Access Windows drives only when necessary
- Large file operations may be slower across the WSL/Windows boundary

### File Editing
- Use WSL-compatible editors: VS Code with Remote-WSL extension, Vim, Emacs, etc.
- Avoid editing the same files simultaneously from Windows and WSL

### Terminal Integration
- Use Windows Terminal for best WSL integration
- Configure profiles for easy access to different WSL distributions
- Use SSH keys stored in the WSL filesystem for remote access

Follow these guidelines to ensure consistent development workflows across the team. 