export const fontCssCode = `
/* Load the font with the weights your app uses. */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

/* Use it for Slice typography. */
:root {
    --slice-font-family: "Inter";
}
`;

export const textStyles = `
<>
    {/* Apply a complete body preset. */}
    <p className="body-s-regular">Small body text</p>

    {/* Keep the heading level and choose its visual style. */}
    <h2 className="h3">Section title</h2>

    {/* Change just the size, inheriting the remaining text styles. */}
    <span style={{fontSize: "var(--font-size-s)"}}>Small text</span>
</>
`;
