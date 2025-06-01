const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const pxtorem = require('postcss-pxtorem');
const chokidar = require('chokidar');

// Paths
const entryFile = path.resolve(__dirname, 'styles', 'main.scss');
const outFile = path.resolve(__dirname, 'styles', 'main.css');

const pxtoremOptions = {
  rootValue: 16,
  unitPrecision: 3,
  propList: [
    'font*',
    'line-height',
    'letter-spacing',
    'word-spacing',
    '*width',
    '*height',
    'margin*',
    'padding*',
  ],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  exclude: /node_modules/i,
};

// PostCSS plugin
const postcssPlugins = [pxtorem(pxtoremOptions)];

// Compile function
async function compile() {
  try {
    const result = sass.compile(entryFile);
    const postcssResult = await postcss(postcssPlugins).process(result.css, {
        from: result.css,
        to: outFile
    });
    fs.writeFileSync(outFile, postcssResult.css);
    console.log(`[${new Date().toLocaleTimeString()}] Compiled.`);
  } catch (err) {
    console.error('❌ Compile error:', err.message);
  }
}

// Initial build
compile();

// Watch all SCSS files in current directory and subdirectories
chokidar
  .watch('./styles',{
      ignored: (path, stats) => stats?.isFile() && !path.endsWith('.scss'), // only watch js files
  })
  .on('change', (filePath) => {
    console.log(`🔄 Detected change: ${filePath}`);
    compile();
  });
