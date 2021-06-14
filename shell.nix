{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/432fc2d9a67f92e05438dff5fdc2b39d33f77997.tar.gz") {} }:

with pkgs;

let
  inherit (lib) optional optionals;
  nodejs = nodejs-14_x;
  typescript = nodePackages.typescript;
in

mkShell {
  buildInputs = [git nodejs typescript]
    ++ optional stdenv.isLinux libnotify
    ++ optional stdenv.isLinux inotify-tools;
}