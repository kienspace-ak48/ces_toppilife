const pageConfigService = require("../services/pageConfig.service");

const CNAME = "pageconfig.controller.js ";
const VNAME = "admin/pageconfig";

const pageConfigController = () => {
  return {
    Index: async (req, res) => {
      try {
        const pc = await pageConfigService.GetOneRecord();
        res.render(VNAME + "/index", { pc });
      } catch (error) {
        res.render(VNAME + "/index", { pc: {} });
      }
    },
    SaveAndUpdate: async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
        const pageconfigDTO = {
          hero: {
            badge: data.hero_badge,
            title: data.hero_title,
            desc: data.hero_desc,
            img_url: data.hero_img_url,
            badge_right: {
              number: data.hero_badge_right_number,
              desc: data.hero_badge_right_desc,
            }
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
            title: data.solution_title,
            img_url: data.solution_img_url,
            desc: data.solution_desc,
            cards: data.solution_cards
          },
          benefit: {
            title: data.benefit_title,
            desc: data.benefit_desc,
            cards: data.benefit_cards,
            footer_card: data.benefit_footer_card
          },
          target_user: {
            title: data.target_user_title,
            list: data.target_user_list,
            note: data.target_user_note,
            img_url: data.target_user_img_url,
          },
          how_to_use:{
            title: data.how_to_use_title,
            desc: data.how_to_use_desc,
            video_url: data.how_to_use_video_url,
            cards: data.how_to_use_cards,
            guide_title: data.howtouse_guide_title,
            guide: data.how_to_use_guide,
          },
          testimonials:data.testimonials,
          faq: {
            title: data.faq_title,
            desc: data.faq_desc,
            list: data.faq_list
          },
          contact: {
            title: data.contact_title,
            desc: data.contact_desc
          }
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
  };
};

module.exports = pageConfigController;
