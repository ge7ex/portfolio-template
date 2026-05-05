# V31 Scrollytelling + PDF Image Fit Fix

## Fixed
- Reduced scrollytelling image height in web Portfolio mode so images do not drop below the visible area at 100% browser zoom.
- Changed scrollytelling images from crop behavior to full-image display behavior.
- Print/PDF now uses `object-fit: contain` for project images, so real images are scaled down instead of cropped.
- First project print auto-fit from V29 is kept, but image content is preserved.
- Quick project edit from V30 and the V31 edit-modal jump behavior are kept.

## Files changed
- `js/components/Experience.js`
- `css/style.css`
