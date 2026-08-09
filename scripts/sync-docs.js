import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';

const configs = [
    {
        year: '2025',
        outputDir: path.join(process.cwd(), 'src', 'content', '2025_tracks'),
        imagePublicDir: path.join(process.cwd(), 'public', 'img', '25track_info'),
        publicImageUrl: '/img/25track_info',
        tracks: {
            track1: '2PACX-1vQ2PgERUC80J2Wxo4NAuTK48nzcX5r0DEraVvYzDiM_qygKjktmonCCt4C6VnoA5rd3RELyT7Me3bG7',
            track2: '2PACX-1vSrvuX2vIVrbMhoXQtHNjmyFfNKNPS54Euob_a9twSGjb9o_RQjwtpBept5aaWdas4aAhd-SPvX-QHT',
            track3: '2PACX-1vTWF7hlEQnL6yRqQqCF2__RuVL2KkxlVX2kWvuSIaDMAS1IVoRtpkgfx6yZLuuAOysQ48n6z1hQ0dqN',
        },        
        pages: {
            introduction: '2PACX-1vQZj_s7_oK39qsDBHVOMGRMVxB7jmZYmc2zDn-tvCAh5uU0uwJxGdDNxJ2Xl9tSd4b4Og3IGX7zTIG2',
        },    
    },
    {
        year: '2026',
        outputDir: path.join(process.cwd(), 'src', 'content', '2026_tracks'),
        imagePublicDir: path.join(process.cwd(), 'public', 'img', '26track_info'),
        publicImageUrl: '/img/26track_info',
        tracks: {
            track1: '2PACX-1vRHFlB59dTbGg92lP8tIdEj7LDh9GYHjR5B64gIvazzjyM7Y6yBMyhQAt2CrZFr-ReaVk_7KeyKW-cF',
            track2: '2PACX-1vSRIkfvXjLejHk1KO__UgHNax9r-ctUmE3_XaDBxplJmfAzykxfGBJhbVpNiMHUVW211M3rDacUm6OJ',
            track3: '2PACX-1vTAoI8Bifg_8E2bEtsiK-Gqi6rHsYjXgESHl2UJ0WWjAzNe403QQ9mgWEdNRkyIEoR6-_IHe3fMP6C_',
        },
        pages: {
            introduction: '2PACX-1vTL2lAqDdNVlPAfH2zJY--nfMVTEwXCEQcv_zp0b1AZXYLSxPc5QxdclLkYi4LMHGwA2UbxMM2nakyR',
        },
    },
];

async function syncDocs() {
    for (const config of configs) {
        await fs.promises.rm(config.outputDir, { recursive: true, force: true });
        await fs.promises.rm(config.imagePublicDir, { recursive: true, force: true });
        console.log(`Cleaned up ${config.year} output directories: ${config.outputDir} and ${config.imagePublicDir}`);
        await fs.promises.mkdir(config.outputDir, { recursive: true});
        await fs.promises.mkdir(config.imagePublicDir, { recursive: true });

        const docEntries = {
            ...config.tracks,
            ...(config.pages || {}),
        };

        for (const [pageKey, docId] of Object.entries(docEntries)) {
            console.log(`Fetching ${config.year} ${pageKey} from Google Docs...`);
            const url = `https://docs.google.com/document/d/e/${docId}/pub?embedded=true`;

            const response = await fetch(url);
            if (!response.ok) {
                const filePath = path.join(config.outputDir, `${pageKey}.html`);
                const errorHtml = `<p>Unable to sync ${config.year} ${pageKey}. Google Docs returned ${response.status} ${response.statusText}. Check the document URL and sharing settings.</p>`;
                await fs.promises.writeFile(filePath, errorHtml, 'utf-8');
                console.error(`Failed to fetch ${config.year} ${pageKey}: ${response.status} ${response.statusText}`);
                continue;
            }

            let html = await response.text();

            html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            html = html.replace(/<!DOCTYPE[^>]*>/gi, '');

            const styleMatches = Array.from(
                html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
            );

            let styleHtml = '';

            for (const match of styleMatches) {
                const css = match[1];
                const scopedCss = await scopeCss(css, '.track-content');
                styleHtml += `<style>${scopedCss}</style>\n`;
            }

            html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            let contentHtml = bodyMatch ? bodyMatch[1] : html;

            contentHtml = contentHtml.replace(
                /<\/?(?:html|head|body|meta|base|link)[^>]*>/gi,
                ''
            );

            contentHtml = `${styleHtml}\n${contentHtml}`;
            const imgRegex = /https:\/\/(?:lh3\.googleusercontent\.com\/[^"\s)]+|docs\.google\.com\/docs-images-rt\/[^"\s)]+)/g;
            const matches = [...new Set(contentHtml.match(imgRegex) || [])];
            let imageIndex = 0;

            for (const imgUrl of matches) {
                try {
                    const imgRes = await fetch(imgUrl);
                    if (!imgRes.ok) {
                        console.warn(`Skipped image ${imgUrl} for ${config.year} ${pageKey}: ${imgRes.status}`);
                        continue;
                    }

                    const buffer = Buffer.from(await imgRes.arrayBuffer());
                    const urlObject = new URL(imgUrl);
                    let extension = path.extname(urlObject.pathname);
                    if (!extension || extension.length > 5) {
                        const contentType = imgRes.headers.get('content-type') || '';
                        extension = contentType.includes('jpeg') ? '.jpg' : contentType.includes('png') ? '.png' : contentType.includes('gif') ? '.gif' : '.png';
                    }
                    const imageName = `${pageKey}-img-${imageIndex}${extension}`;
                    const localImagePath = path.join(config.imagePublicDir, imageName);

                    await fs.promises.writeFile(localImagePath, buffer);
                    contentHtml = contentHtml.replaceAll(imgUrl, `${config.publicImageUrl}/${imageName}`);
                    imageIndex++;
                } catch (err) {
                    console.error(`Failed to download image for ${config.year} ${pageKey}:`, err);
                }
            }

            const filePath = path.join(config.outputDir, `${pageKey}.html`);
            await fs.promises.writeFile(filePath, contentHtml, 'utf-8');
            console.log(`Successfully synced and localized ${config.year} ${pageKey}`);
        }
    }
}

async function scopeCss(css, prefix) {
    const result = await postcss([
        prefixSelector({
            prefix,
        }),
    ]).process(css, { from: undefined });

    return result.css;
}

syncDocs().catch((error) => {
    console.error(error);
    process.exit(1);
});
