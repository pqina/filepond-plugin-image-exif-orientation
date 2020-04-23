import { isBrowser } from './isBrowser';

// 2x1 pixel image 90CW rotated with orientation header
const testSrc = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAIBASIA/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=';

// should correct orientation if is presented in landscape, in which case the browser doesn't autocorrect
let shouldCorrect = undefined;
const testImage = isBrowser() ? new Image() : {};
testImage.onload = () => shouldCorrect = testImage.naturalWidth > testImage.naturalHeight;
testImage.src = testSrc;

export const shouldCorrectImageExifOrientation = () => shouldCorrect;