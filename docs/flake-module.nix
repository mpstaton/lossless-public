{
perSystem = { config, self', inputs', pkgs, lib, system, ... }: {
    packages.docs = pkgs.buildNpmPackage {
      pname = "docs";
      version = "0.1.0";

      inherit (config.packages) nodejs;

      src = ./.;

      buildInputs = [
        pkgs.vips
      ];

      nativeBuildInputs = [
        pkgs.pkg-config
      ];

      installPhase = ''
        runHook preInstall
        cp -pr --reflink=auto dist $out/
        runHook postInstall
      '';

      npmDepsHash = "sha256-cmlYGTS/RsOArg9H3y4tW6kuCTT4g3ZfkQMYvkubsTA=";
    };
  };
}