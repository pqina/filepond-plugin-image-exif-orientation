const Marker = {
    JPEG: 0xffd8,
    APP1: 0xffe1,
    EXIF: 0x45786966,
    TIFF: 0x4949,
    Orientation: 0x0112,
    Unknown: 0xff00
};

const getUint16 = (view, offset, little = false) =>
    view.getUint16(offset, little);
const getUint32 = (view, offset, little = false) =>
    view.getUint32(offset, little);

export const getImageOrientation = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const view = new DataView(e.target.result);

            // Every JPEG file starts from binary value '0xFFD8'
            if (getUint16(view, 0) !== Marker.JPEG) {
                // This aint no JPEG
                resolve(-1);
                return;
            }

            const length = view.byteLength;
            let offset = 2;

            while (offset < length) {
                const marker = getUint16(view, offset);
                offset += 2;

                // There's our APP1 Marker
                if (marker === Marker.APP1) {

                    if (getUint32(view, (offset += 2)) !== Marker.EXIF) {
                        // no EXIF info defined
                        break;
                    }

                    // Get TIFF Header
                    const little = getUint16(view, (offset += 6)) === Marker.TIFF;
                    offset += getUint32(view, offset + 4, little);

                    const tags = getUint16(view, offset, little);
                    offset += 2;

                    for (let i = 0; i < tags; i++) {
                        // found the orientation tag
                        if (
                            getUint16(view, offset + i * 12, little) ===
                            Marker.Orientation
                        ) {
                            resolve(
                                getUint16(view, offset + i * 12 + 8, little)
                            );
                            return;
                        }
                    }

                } else if ((marker & Marker.Unknown) !== Marker.Unknown) {
                    // Invalid
                    break;
                } else {
                    offset += getUint16(view, offset);
                }
            }

            // Nothing found
            resolve(-1);
        };

        // we don't need to read the entire file to get the orientation
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
