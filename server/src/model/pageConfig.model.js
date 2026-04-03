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
    // YouTube URL hoặc 11-char videoId hiển thị dưới section PainPoints
    video_title: String,
    video_url: String,
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
  /**
   * Carousel video feedback (Shorts-style).
   * items[]: mỗi phần tử { video_url, thumbnail?, headline?, badge?, caption?, brand_label? }
   * video_urls: legacy — nếu không có items thì client map từ video_urls
   */
  feedback: {
    title: String,
    subtitle: String,
    video_urls: [String],
    items: [
      {
        video_url: String,
        thumbnail: String,
        headline: String,
        badge: String,
        caption: String,
        brand_label: String,
        _id: false,
      },
    ],
  },
  /** So sánh trước / sau khi dùng sản phẩm */
  comparison: {
    title: String,
    before_label: String,
    after_label: String,
    before: [],
    after: [],
  },
  /** Vì sao chọn CES — danh sách gạch đầu dòng + ảnh minh họa */
  ces_why: {
    title: String,
    bullets: [],
    img_url: String,
  },
  customize: {
  }
}, {timestamps: true});

module.exports = mongoose.model('page_config', pageConfigSchema);
