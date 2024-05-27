# Contributing

This repository is configured to use a [Dev Container](https://containers.dev) for development. This means that you can contribute to this repository using a containerized environment. This is useful because it ensures that all contributors are using the same development environment, which reduces the chances of bugs and issues caused by differences in development environments.

## Getting Started

### Using GitHub Codespaces

You can use GitHub Codespaces to contribute to this repository, this will open the repository in a containerized environment in the cloud. To use GitHub Codespaces, click on the button below:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/icoseuk/restmaker)

### Using local Dev Containers

If you want to contribute to this repository by setting up the Dev Container locally on your machine, follow the instructions below:

#### Prerequisites

You need to have the following software installed on your local machine to contribute to this project:

- **Docker**: Install Docker on your local machine by following the instructions provided in the [Docker documentation](https://www.docker.com/get-started/).
- **Visual Studio Code**: Install Visual Studio Code on your local machine by downloading it from the [official website](https://code.visualstudio.com).

#### Setting up the Dev Container

To get started quickly, you can simply click on the button below. This will open the repository in a containerized environment in Visual Studio Code:

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/icoseuk/restmaker)

All this button does is open the repository in Visual Studio Code with the Dev Container configured. If you prefer to set up the Dev Container manually, follow the instructions below:

1. Clone the repository and open it in Visual Studio Code:

```bash
# Clone the repository
git clone https://github.com/icoseuk/restmaker.git

# Open the repository in Visual Studio Code
code restmaker
```

2. Open the repository in a Dev Container:

   - Open the Command Palette in Visual Studio Code by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
   - Type `Dev Containers: Reopen in Container` and press `Enter`.

### Installing Dependencies

The Dev Container set up takes care of the initial dependency installation upon first opening the project.

### Running the project

1. A launch configuration is also provided for debugging the project within Visual Studio Code, so head on to the `Run and Debug` tab to start the project.
2. Visit the `Ports` tab in the bottom left corner of Visual Studio Code to view the exposed Dev Container ports and open the project in your browser by clicking on the globe icon next to the port number.

### Branching Strategy

This repository is branched based on the the corresponding GitHub issue keys. For example, if you are working on an issue with the key `RM-1`, you should create a branch named `RM-1` from the `main` branch. Once you are done with the changes, you can create a pull request to merge your changes back to the `main` branch.

### Commit Messages

Make sure your commit messages are clear and concise.

### Pull Requests

Before creating a pull request, make sure your code is properly formatted and tested. Also, make sure to reference the issue you are working on in the pull request description.

### Code of Conduct

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing to this repository.
