const mongoose = require("mongoose");
const lsugify = require("slugify");

const pageConfigSchema = new mongoose.Schema({
  hero: {
    badge: String,
    title: String,
    desc: String,
    img_url: String,
    badge_right: {
      number: String,
      desc: String,
    },
    _id: false,
  },
  issue: {
    title: String,
    issues: [],
    card: {
      title: String,
      desc: String,
      img_url: String,
    },
  },
  solution: {
    img_url: String,
    title: String,
    desc: String,
    cards: [{ icon: String, title: String, desc: String, _id: false }],
  },
  benefit: {
    title: String,
    desc: String,
    cards: {
      img_url: String,
      icon: String,
      title: String,
      desc: String,
    },
    footer_card: {
      img_url: String,
      lable: String,
      solution: [],
    },
  },
  target_user: {
    title: String,
    list: [],
    note: String,
    img_url: String,
  },
  how_to_use: {
    title: String,
    desc: String,
    cards: [
      {
        img_url: String,
        title: String,
        desc: String,
        _id: false,
      },
    ],
    guide_title: String,
    guide:[
      { minute: String, desc: String, _id: false }
    ],
    
    video_url: String,
  },
  testimonials: [{ icon: String, title: String, desc: String, _id:false }],
  faq: {
    title: String,
    desc: String,
    list: [{ question: String, anwser: String, _id: false }],
  },
  contact: {
    title: String,
    desc: String,
  },
  customize: {
  }
}, {timestamps: true});

module.exports = mongoose.model('page_config', pageConfigSchema);
