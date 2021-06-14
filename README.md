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
- Elixir `1.12.1`
- Erlang/OTP `24`


## Run

### Typescript

```bash
nix-shell --run "tsc transform.ts && node transform.js"
```

### Elixir

```bash
nix-shell --run "elixirc transform.ex && elixir -e Transform.run"
```