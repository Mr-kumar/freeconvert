declare module "qpdf-wasm" {
  interface QPDFModule {
    FS: {
      writeFile(path: string, data: Uint8Array): void;
      readFile(path: string): Uint8Array;
      unlink(path: string): void;
    };
    callMain(args: string[]): number;
  }

  interface QPDFInitOptions {
    locateFile?: (path: string) => string;
    print?: (message: string) => void;
    printErr?: (message: string) => void;
  }

  export default function init(options?: QPDFInitOptions): Promise<QPDFModule>;
}
