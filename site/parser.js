const fs = require("fs-extra");
const path = require("path");
const Papa = require("papaparse");

const inputDirectory = "../items";
const outputFile = "./radar.csv";

const folderOrder = ["Adopt", "Trial", "Assess", "Hold"]; // Add folder names in the desired order

async function parseDirectory(
  dir,
  previousData,
  depth = 0,
  quadrant = null,
  ring = null
) {
  const parsedData = [];
  const files = await fs.readdir(dir);

  // Sort folders based on folderOrder
  const sortedFiles = files.sort((a, b) => {
    const aIndex = folderOrder.indexOf(a);
    const bIndex = folderOrder.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });

  for (const file of sortedFiles) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      const currentDepth = depth + 1;
      let currentRing, currentQuadrant;

      if (currentDepth === 1) {
        currentRing = path.basename(filePath);
        currentQuadrant = null;
      } else if (currentDepth === 2) {
        currentRing = ring;
        currentQuadrant = path.basename(filePath);
      }

      const nestedData = await parseDirectory(
        filePath,
        previousData,
        currentDepth,
        currentQuadrant,
        currentRing
      );
      parsedData.push(...nestedData);
    } else if (path.extname(file) === ".txt") {
      const description = (await fs.readFile(filePath, "utf8")).replace(
        /\r?\n/g,
        "<br>"
      );
      const name = path.basename(file, ".txt");
      const isNew = !previousData.some(
        (item) => item.name === name && item.description === description
      );
      parsedData.push({
        quadrant,
        ring: ring || "default",
        name,
        description,
        isNew,
      });
    }
  }

  return parsedData;
}

async function main() {
  try {
    const previousData = await fs
      .readFile(outputFile, "utf8")
      .then(
        (csv) => Papa.parse(csv, { header: true, dynamicTyping: true }).data
      )
      .catch(() => []);

    const parsedData = await parseDirectory(inputDirectory, previousData);
    const output = Papa.unparse(parsedData, {
      header: true,
      newline: "\r\n",
    });
    await fs.writeFile(outputFile, output);
    console.log(`CSV output written to ${outputFile}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
