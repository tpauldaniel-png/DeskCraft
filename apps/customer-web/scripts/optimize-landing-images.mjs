import sharp from "sharp";


const landingSourceRoot = "./image-sources/public-images/landing-page";
const landingOutputRoot = "./public/images/landing-page";
const assetSourceRoot = "./image-sources/src-assets";
const assetOutputRoot = "./src/assets"


const categoryImageNames = [
    "accessories",
    "bundle",
    "chair",
    "desk",
];

for(const imageName of categoryImageNames) {

    const inputPath = `${landingSourceRoot}/category/${imageName}.png`;
    const outputPath = `${landingOutputRoot}/category/${imageName}.webp`;

    const result = await sharp(inputPath)
    .rotate()
    .resize({
        width: 700,
        withoutEnlargement: true,
    })
    .webp({
        quality: 82,
    })
    .toFile(outputPath);

    console.log("optimized image" , {
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKB: Math.round(result.size/1024),
    });

}

const heroImageNames = [
    "hero-pic4",
    "hero-pic5",
];

for(const imageName of heroImageNames) {

    const inputPath = `${landingSourceRoot}/hero/${imageName}.png`;
    const outputPath = `${landingOutputRoot}/hero/${imageName}.webp`;

    const result = await sharp(inputPath)
    .rotate()
    .webp({
        quality: 82,
    })
    .toFile(outputPath);

    console.log("optimized image" , {
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKB: Math.round(result.size/1024),
    });

}

const cardImages = [
    {folder: "featured", name:"featured-chair"},
    {folder: "featured", name:"featured-desk"},
    {folder: "featured", name:"featured-footrest"},
    {folder: "featured", name:"featured-monitor-arm"},

    {folder: "shop-by-need", name: "developer-setup"},
    {folder: "shop-by-need", name: "small-spaces-setup"},
    {folder: "shop-by-need", name: "study-setup"},
    {folder: "shop-by-need", name: "work-from-home-setup"},

]

for(const image of cardImages) {

    const inputPath = `${landingSourceRoot}/${image.folder}/${image.name}.png`;
    const outputPath = `${landingOutputRoot}/${image.folder}/${image.name}.webp`;

    const result = await sharp(inputPath)
    .rotate()
    .resize({
        width: 700,
        withoutEnlargement: true,
    })
    .webp({
        quality: 82,
    })
    .toFile(outputPath);

    console.log("optimized image" , {
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKB: Math.round(result.size/1024),
    });

}

const bundleImages = [
    "developer-bundle",
    "office-bundle",
    "study-bundle",
]

for (const image of bundleImages) {
    const inputPath = `${landingSourceRoot}/bundle/${image}.png`;
    const outputPath = `${landingOutputRoot}/bundle/${image}.webp`;

    const result = await sharp(inputPath)
    .rotate()
    .webp({
        quality: 82,
    })
    .toFile(outputPath);

    console.log("optimized image" , {
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKB: Math.round(result.size/1024),
    });

}

const aiInputPath = `${landingSourceRoot}/ai-assistant.png`;
const aiOutputPath = `${landingOutputRoot}/ai-assistant.webp`;

const aiAssistantResult = await sharp(aiInputPath)
    .rotate()
    .webp({
        quality: 82,
    })
    .toFile(aiOutputPath)

console.log("optimized image" , {
        format: aiAssistantResult.format,
        width: aiAssistantResult.width,
        height: aiAssistantResult.height,
        sizeKB: Math.round(aiAssistantResult.size/1024),
});



const logos = [
    {
        input: `${assetSourceRoot}/dc-logo.png`,
        output: `${assetOutputRoot}/dc-logo.webp`,
    },
    {
        input: `${assetSourceRoot}/dc-full-logo-white.png`,
        output: `${assetOutputRoot}/dc-full-logo-white.webp`
    }
]

for (const logo of logos) {
    const result = await sharp(logo.input)
        .resize({
            height: 96,
            withoutEnlargement: true,
        })
        .webp({
            lossless: true
        })
        .toFile(logo.output)

    
    console.log("optimized image" , {
        output: logo.output,
        format: result.format,
        width: result.width,
        height: result.height,
        sizeKB: Math.round(result.size/1024),
    });
}


const authInputImage = `${assetSourceRoot}/customer-auth-workspace.png`;
const authOutputImage = `${assetOutputRoot}/customer-auth-workspace.webp`;

const authResult = await sharp(authInputImage)
    .rotate()
    .webp({quality: 82})
    .toFile(authOutputImage);

console.log("optimized image" , {
        output: authOutputImage,
        format: authResult.format,
        width: authResult.width,
        height: authResult.height,
        sizeKB: Math.round(authResult.size/1024),
});


const mobileHeroInputPath = `${landingSourceRoot}/hero/hero-pic4.png`;
const mobileHeroOutputPath = `${landingOutputRoot}/hero/hero-pic4.webp`;

const mobileHeroResult = await sharp(mobileHeroInputPath)
    .rotate()
    .resize({
        width: 960,
        withoutEnlargement: true,
    })
    .webp({
        quality: 80
    })
    .toFile(mobileHeroOutputPath);

console.log("optimized image" , {
        output: mobileHeroOutputPath,
        format: mobileHeroResult.format,
        width: mobileHeroResult.width,
        height: mobileHeroResult.height,
        sizeKB: Math.round(mobileHeroResult.size/1024),
});




