const pageConfigService = require("../services/pageConfig.service");

const CNAME = "pageconfig.controller.js ";
const VNAME = "admin/pageconfig";

function splitLines(v) {
  if (v == null) return [];
  if (Array.isArray(v))
    return v.map(String).map((s) => s.trim()).filter(Boolean);
  return String(v)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** JSON array feedback.items hoặc fallback từ feedback_video_urls */
function parseFeedbackItems(data) {
  const raw = data.feedback_items_json;
  if (raw && String(raw).trim()) {
    try {
      const j = JSON.parse(String(raw));
      if (Array.isArray(j) && j.length > 0) return j;
    } catch (e) {
      console.log(CNAME, "feedback_items_json parse error", e.message);
    }
  }
  if (Array.isArray(data.feedback_items) && data.feedback_items.length > 0)
    return data.feedback_items;
  const urls = splitLines(data.feedback_video_urls);
  return urls.map((video_url) => ({ video_url }));
}

const pageConfigController = () => {
  return {
    Index: async (req, res) => {
      try {
        // 
        const pc = await pageConfigService.GetOneRecord();
        res.render(VNAME + "/index", { pc });
      } catch (error) {
        res.render(VNAME + "/index", { pc: {} });
      }
    },
    SaveAndUpdate: async (req, res) => {
      try {
        const data = req.body;
        // console.log(data);
        const pageconfigDTO = {
          hero: {
            badge: data.hero_badge,
            title: data.hero_title,
            desc: data.hero_desc,
            img_url: data.hero_img_url,
            badge_right: {
              number: data.hero_badge_right_number,
              desc: data.hero_badge_right_desc,
            },
          },
          issue: {
            title: data.issue_title,
            issues: data.issue_issues,
            card: {
              title: data.issue_card_title,
              desc: data.issue_card_desc,
              img_url: data.issue_card_img_url,
            },
          },
          solution: {
            video_title: data.solution_video_title,
            video_url: data.solution_video_url,
            title: data.solution_title,
            img_url: data.solution_img_url,
            desc: data.solution_desc,
            cards: data.solution_cards,
            debunk_title: data.solution_debunk_title,
            debunk_boxes: data.solution_debunk_boxes,
          },
          benefit: {
            title: data.benefit_title,
            desc: data.benefit_desc,
            cards: data.benefit_cards,
            footer_card: data.benefit_footer_card,
          },
          target_user: {
            title: data.target_user_title,
            list: data.target_user_list,
            note: data.target_user_note,
            img_url: data.target_user_img_url,
          },
          how_to_use: {
            title: data.how_to_use_title,
            desc: data.how_to_use_desc,
            video_url: data.how_to_use_video_url,
            cards: data.how_to_use_cards,
            guide_title: data.howtouse_guide_title,
            guide: data.how_to_use_guide,
          },
          testimonials: data.testimonials,
          faq: {
            title: data.faq_title,
            desc: data.faq_desc,
            list: data.faq_list,
          },
          contact: {
            title: data.contact_title,
            desc: data.contact_desc,
          },
          gift_promo: {
            title: data.gift_promo_title,
            subtitle: data.gift_promo_subtitle,
            image_url: data.gift_promo_image_url,
            image_desc: data.gift_promo_image_desc,
            offer_label: data.gift_promo_offer_label,
            discount_text: data.gift_promo_discount_text,
            countdown_until: data.gift_promo_countdown_until,
            cta_text: data.gift_promo_cta_text,
          },
          safety_notice: {
            title: data.safety_notice_title,
            boxes: data.safety_notice_boxes,
          },
          feedback: {
            title: data.feedback_title,
            subtitle: data.feedback_subtitle,
            video_urls: splitLines(data.feedback_video_urls),
            items: parseFeedbackItems(data),
          },
          comparison: {
            title: data.comparison_title,
            before_label: data.comparison_before_label,
            after_label: data.comparison_after_label,
            before: splitLines(data.comparison_before_lines),
            after: splitLines(data.comparison_after_lines),
            table_columns: data.comparison_table_columns,
            table_rows: data.comparison_table_rows,
          },
          medical_proof: {
            title: data.medical_proof_title,
            img_url: data.medical_proof_img_url,
            boxes: data.medical_proof_boxes,
          },
          ces_why: {
            title: data.ces_why_title,
            bullets: splitLines(data.ces_why_bullets),
            img_url: data.ces_why_img_url,
          },
        };
        const task1 = await pageConfigService.AddAndUpdate(pageconfigDTO);
        if (!task1) {
          return res.error("Process update failed", 400);
        }
        res.success();
      } catch (error) {
        console.log(CNAME, error.message);
        res.error(error.message);
        // res.render(VNAME+'/index', {success: false, error: error.message})
      }
    },
    CustomizeSection: async (req, res) => {
      try {
        // const pc = await getPageConfigFx();
        const pc = await pageConfigService.GetOneRecord(); 
        res.render(VNAME + "/customize", { data: pc });
      } catch (error) {
        res.render(VNAME + "/customize", { data: {} });
      }
    },
    //
    SaveCustomizeSection: async (req, res) => {
      try {
        const data = req.body;
        const cDTO = {
          customize: {
            email: data.pageinfo_email,
            phone: data.pageinfo_phone,
            zalo: data.pageinfo_zalo,
            address: data.pageinfo_address,
            facebook: data.pageinfo_facebook,
            tiktok: data.pageinfo_tiktok,
            youtube: data.pageinfo_youtube,
            worktime: data.worktime,
            title: data.webname,
            canonical: data.canonical,
            img: data.img || "image1.jpg",
            desc: data.desc,
            keywords: data.keywords,
            gg_a: data.gg_a || "--no--",
            gg_wt: data.gg_wt || "--no--",
            gtm_container_id: String(data.marketing_gtm_id || "").trim(),
            facebook_pixel_id: String(
              data.marketing_fb_pixel_id || "",
            ).replace(/\D/g, ""),
          },
        };
        console.log(cDTO);
        const task1 =await pageConfigService.AddAndUpdate(cDTO);
        // const task1 = true;
        if (!task1) {
          throw new Error(CNAME + "update customize_section failed");
        }
        res.json({ success: true });
      } catch (error) {
        // res.render(VANME+'')
        console.log(CNAME, error.message);
        res.status(500).json({ success: false, mess: "Server error" });
      }
    },
  };
};

module.exports = pageConfigController;
