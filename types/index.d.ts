declare module "filepond-plugin-image-exif-orientation" {
    const FilepondPluginImageExifOrientation: FilepondPluginImageExifOrientationProps;
    export interface FilepondPluginImageExifOrientationProps {
        /** Enable or disable file type validation. */
        allowImageExifOrientation: boolean;
    }
    export default FilepondPluginImageExifOrientation;
}