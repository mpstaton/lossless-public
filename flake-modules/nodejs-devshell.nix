# flake-modules/nodejs-devshell.nix
{ inputs, ...}: {
  imports = [
    inputs.devshell.flakeModule
  ];

  perSystem = { config, ... }: {
    devshells.default = {
      commands = [
        { package = config.packages.nodejs; category = "docs"; }
      ];
    };
  };
}