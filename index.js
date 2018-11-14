/*
config:
{
  "dist": "./",
  "gif": {
    "interlaced": true,
    "optimizationlevel": 3
  },
  "jpeg": {
    "progressive": true,
    "max": 80
  },
  "png": {
    "floyd": 0.5,
    "nofs": false,
    "quality": 100,
    "speed": 3,
    "verbose": false
  },
  "webp": {
    "use": true,
    "preset": "default",
    "quality": 75,
    "alphaQuality": 100,
    "method": 4,
    "sns": 80,
    "lossless": false
  }
}
* */

const
    fs = require('fs'),
    imagemin = require('imagemin'), //Optimize images
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminJpegoptim = require('imagemin-jpegoptim'), //jpegoptim plugin for imagemin
    imageminPngquant = require('imagemin-pngquant'), //PNGquant plugin for imagemin
    imageminSvgo = require('imagemin-svgo'),
    imageminWebp = require('imagemin-webp'); //Webp plugin for imagemin

module.exports = (config, path) => {
    var basepath = path.replace('**/*', '');
    fs.readdir(basepath, (err, files) => {
        if (files === undefined) return;
        files.forEach(file => {
            if (fs.lstatSync(basepath + file).isDirectory()) {
                optimizeImage(basepath + file + '**/*', basepath + config.dist + file);
                if (config.webp.use) convertWebP(basepath + file + '**/*', basepath + config.dist + file);
            }
        });
        optimizeImage(basepath + '*.*', basepath + config.dist);
        if (config.webp.use) convertWebP(basepath + '*.*', basepath + config.dist);
    });
};

function optimizeImage(path, dest) {
    imagemin([path], dest, {
        plugins: [
            imageminGifsicle({
                interlaced: config.gif.interlaced,
                optimizationLevel: config.gif.optimizationlevel
            }),
            imageminJpegoptim({
                progressive: config.jpeg.progressive,
                max: config.jpeg.max
            }),
            imageminPngquant({
                floyd: config.png.floyd,
                nofs: config.png.nofs,
                quality: config.png.quality,
                speed: config.png.speed,
                verbose: config.png.verbose
            }),
            imageminSvgo()
        ]
    });
}

function convertWebP(path, dest) {
    imagemin([path], dest, {
        plugins: [
            imageminWebp({quality: 50})
        ]
    });
}