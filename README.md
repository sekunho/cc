# cc

## Setup

### Through `nix`

I haven't tested this with macOS, only Linux.

Install `nix`

```bash
curl -L https://nixos.org/nix/install | sh
```

Activate the environment

```bash
# At root of project directory
nix-shell
```

Done!

### Manuall install

If you prefer to manually install the dependencies, here are the versions of the dependencies used.

- NodeJS `v14.17.0`
- Typescript `4.3.2`

## Run

```bash
nix-shell --run "tsc *.ts --target es2016 && node transform.js"
```