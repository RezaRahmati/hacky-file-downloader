import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { default as fetch, Headers } from 'node-fetch';
import { writeFile } from 'fs';
import { promisify } from 'util';
const writeFilePromise = promisify(writeFile);

dotenv.config();

const folderId = 1238;
const outputFolder = 'c:/tmp/'
const referer = "https://lockbitaptc2iq4atewz2ise62q63wfktyrl4qtwuk5qax262kgtzjqd.onion.ly/post/USLfL9XIAOk9xnX562344fec4aac8";
const cookie = "_ga_7592W6XHM5=GS1.1.1649811354.3.1.1649813741.0; _ga=GA1.1.1985657905.1649805266; res=250AD0C11159004452E4E1BC5D695D3BA98E155067517; PHPSESSID=c386jmdbrb79ncvcmuvkapt3nd";
const skipProcessed = false;

const getDate = () => {
    return new Date()
        .toLocaleString()
        .replace(/[T,]/gi, '')
        .replace(/[\/: ]/gi, '-');
};

const delay = (ms) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addFileToProcessed = (saveTo, fileName) => {
    fs.appendFileSync(saveTo, `${fileName}\n`);
}

const readProcessedFiles = (fileName) => {
    if (fs.existsSync(fileName)) {
        return fs.readFileSync(fileName).toString().split("\n");
    }

    return [];
}

const readListOfFiles = (fileName) => {
    if (fs.existsSync(fileName)) {
        return fs.readFileSync(fileName).toString().split("\n");
    }

    return [];
}


(async () => {

    const listOfFilesAndFolders = readListOfFiles(`c:/tmp/samplefiles.txt`);

    downloadFiles([
        `GENAZSSP01/Y/admin.jasper/desktop/microsoft teams.lnk`,
        `GENAZSSP01/Y/CathlinRossiter/desktop/aa55d23d1909b35462b33d96b41d4510.jpg`
    ]);

})();

async function downloadFiles(files) {
    try {
        const processedFileName = path.join(outputFolder, 'processed.txt');
        const processedFiles = readProcessedFiles(processedFileName);

        const start = new Date();

        const promises = [];

        let fileIndex = 0;
        let processedCount = 0;
        let filesCount = files.length;

        console.log(`${filesCount} files`);

        for (let file of files) {
            if (processedFiles.includes(file) && skipProcessed === true) {
                console.log(`skipping ${file}`);
                continue;
            }
            await delay(rand(1000, 7000));

            fileIndex += 1;

            console.log(`Processing ${file} started. ${fileIndex} of ${filesCount}`);

            var myHeaders = new Headers();
            myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0");
            myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
            myHeaders.append("Accept-Language", "en-CA,en-US;q=0.7,en;q=0.3");
            myHeaders.append("Accept-Encoding", "gzip, deflate, br");
            myHeaders.append("Connection", "keep-alive");
            myHeaders.append("Referer", referer);
            myHeaders.append("Cookie", cookie);
            myHeaders.append("Upgrade-Insecure-Requests", "1");
            myHeaders.append("Sec-Fetch-Dest", "document");
            myHeaders.append("Sec-Fetch-Mode", "navigate");
            myHeaders.append("Sec-Fetch-Site", "same-origin");
            myHeaders.append("Sec-Fetch-User", "?1");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const url = `https://lockbitaptc2iq4atewz2ise62q63wfktyrl4qtwuk5qax262kgtzjqd.onion.ly/ajax/listing-post?file-download=true&folder-id=${folderId}&data-dir=${encodeURI(file)}`;

            const outputFile = path.join(outputFolder, file);
            fs.mkdir(path.dirname(outputFile), { recursive: true }, (err) => {
                if (err) throw err;
            })

            promises.push(
                fetch(url, requestOptions)
                    .then(x => {
                        processedCount += 1;
                        return x;
                    })
                    .then(x => x.arrayBuffer())
                    .then(x => writeFilePromise(outputFile, Buffer.from(x)))
                    .then(() => addFileToProcessed(processedFileName, file))
                    .catch((err) => {
                        console.error('Error', file, err);
                        return null;
                    }),
            );
        }

        const responses = await Promise.allSettled(promises);

        responses
            .map((r) => {
                if (r.status === 'fulfilled') {
                    const value = r.value;

                    return value;
                } else {
                    return null
                }
            })
            .filter((o) => !!o);

        const end = new Date();

        console.log(
            `Processing ${filesCount} files done in ${Math.floor(
                (end - start) / 1000 ,
            )} seconds`,
        );
    } catch (e) {
        console.error('Whoops!', e);
    }
}


