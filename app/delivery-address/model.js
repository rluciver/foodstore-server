const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const { model, Schema } = mongoose.set("useCreateIndex", true);

const deliveryAddressSchema = Schema(
  {
    nama: {
      type: String,
      require: [true, "nama alamat harus diisi"],
      maxlength: [255, "panjang maksimal nama alamat 255 karakter"],
    },
    kelurahan: {
      type: String,
      require: [true, "kelurahan harus diisi"],
      maxlength: [255, "panjang maksimal kelurahan 255 karakter"],
    },
    kecamatan: {
      type: String,
      require: [true, "kecamatan harus diisi"],
      maxlength: [255, "panjang maksimal kecamatan 255 karakter"],
    },
    kabupaten: {
      type: String,
      require: [true, "kabupaten harus diisi"],
      maxlength: [255, "panjang maksimal kabupaten 255 karakter"],
    },
    provinsi: {
      type: String,
      require: [true, "provinsi harus diisi"],
      maxlength: [255, "panjang maksimal provinsi 255 karakter"],
    },
    detail: {
      type: String,
      require: [true, "detail harus diisi"],
      maxlength: [255, "panjang maksimal detail 255 karakter"],
    },
    user: {
      type: Schema.type.ObjectId,
      ref: "User",
    },
  },
  { Timestamp: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);