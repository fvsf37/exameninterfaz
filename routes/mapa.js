var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", function (req, res, next) {
  res.render("mapa", { title: "Mapa de Monumentos" });
});

router.get("/datos/monumentos", function (req, res, next) {
  res.sendFile(
    path.join(__dirname, "../data/da_cultura_ocio_monumentos-4326.geojson")
  );
});

module.exports = router;
