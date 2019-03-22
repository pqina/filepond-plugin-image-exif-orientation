import { isJPEG } from './utils/isJPEG';
import { getImageOrientation } from './utils/getImageOrientation';

/**
 * Read Image Orientation Plugin
 */
const plugin = ({ addFilter, utils }) => {
    const { Type, isFile } = utils;

    // subscribe to file load and append required info
    addFilter(
        'DID_LOAD_ITEM',
        (item, { query }) =>
            new Promise((resolve, reject) => {
                // get file reference
                const file = item.file;

                // if this is not a jpeg image we are not interested
                if (
                    !isFile(file) ||
                    !isJPEG(file) ||
                    !query('GET_ALLOW_IMAGE_EXIF_ORIENTATION')
                ) {
                    // continue with the unaltered dataset
                    return resolve(item);
                }

                // get orientation from exif data
                getImageOrientation(file).then(orientation => {
                    item.setMetadata('exif', {
                        orientation
                    });

                    resolve(item);
                });
            })
    );

    // Expose plugin options
    return {
        options: {
            // Enable or disable image orientation reading
            allowImageExifOrientation: [true, Type.BOOLEAN]
        }
    };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
if (isBrowser) {
    document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));
}

export default plugin;