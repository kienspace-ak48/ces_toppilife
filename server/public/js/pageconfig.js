function toggleSection(id) {
  const el = document.querySelector("#" + id);
  el.classList.toggle("d-none");
  if (!el.classList.contains("d-none")) {
    setTimeout(() => initTinyEditors(el), 0);
  }
}
document.querySelectorAll("section > div").forEach((el) => {
  el.classList.toggle("d-none");
});

function normalizeGallerySrc(path) {
  if (!path) return "";
  const s = String(path).trim();
  return s.startsWith("/") ? s : `/${s}`;
}

function debunkInsertedImageHtml(relativePath) {
  const src = normalizeGallerySrc(relativePath);
  return `<p><img src="${src}" alt="" style="max-width:100%;height:auto;display:block;"></p>`;
}

async function uploadDebunkEditorImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  fd.append("folder_id", "all");

  const res = await fetch("/admin/gallery/image-upload-ajax", {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!data.success)
    throw new Error(data.mess || "Upload thất bại");
  const rec = data.uploaded || (Array.isArray(data.images) && data.images[0]);
  if (!rec?.path)
    throw new Error("Không nhận được đường dẫn ảnh");
  return rec.path;
}

function initTinyEditors(root = document) {
  if (!window.tinymce) return;

  root.querySelectorAll("textarea.tinymce-editor:not([data-tiny-ready])").forEach((textarea) => {
    if (!textarea.id) {
      textarea.id = `tiny_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }
    textarea.dataset.tinyReady = "1";

    const isDebunk = Boolean(textarea.closest("#solution_debunk_wrapper"));

    const cfg = {
      target: textarea,
      license_key: "gpl",
      menubar: false,
      branding: false,
      height: 220,
      plugins: "lists link",
      toolbar:
        "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link | removeformat",
      convert_urls: false,
    };

    if (isDebunk) {
      cfg.toolbar +=
        " | uploaddebunkimg";
      cfg.content_style = "img { max-width:100%; height:auto; display:block; }";
      cfg.paste_data_images = true;
      cfg.automatic_uploads = true;
      cfg.images_upload_handler = (blobInfo /* , progress */) =>
        new Promise((resolve, reject) => {
          const fd = new FormData();
          fd.append("image", blobInfo.blob(), blobInfo.filename?.() || "image.png");
          fd.append("folder_id", "all");
          fetch("/admin/gallery/image-upload-ajax", { method: "POST", body: fd })
            .then((r) => r.json())
            .then((data) => {
              if (!data.success) {
                reject(data.mess || "Upload thất bại");
                return;
              }
              const rec = data.uploaded || data.images?.[0];
              if (!rec?.path) {
                reject("Không có path ảnh");
                return;
              }
              resolve(normalizeGallerySrc(rec.path));
            })
            .catch((e) => reject(String(e)));
        });
      cfg.setup = function (editor) {
        editor.ui.registry.addButton("uploaddebunkimg", {
          text: "↑ Ảnh",
          tooltip:
            "Chọn ảnh máy → lưu lên Gallery (như uploads) → chèn vào ô soạn",
          onAction() {
            window.__pageconfigTinyUploadTarget = editor;
            document.getElementById("debunk_tinymce_image_upload")?.click();
          },
        });
      };
    }

    tinymce.init(cfg);
  });
}

function removeTinyEditors(root) {
  if (!window.tinymce || !root) return;

  root.querySelectorAll("textarea.tinymce-editor").forEach((textarea) => {
    const editor = tinymce.get(textarea.id);
    if (editor) editor.remove();
  });
}

//
document.addEventListener("DOMContentLoaded", () => {
  const debunkPick = document.getElementById("debunk_tinymce_image_upload");
  if (debunkPick) {
    debunkPick.addEventListener("change", async (e) => {
      const editor = window.__pageconfigTinyUploadTarget;
      const input = e.target;
      const file = input.files && input.files[0];
      input.value = "";
      if (!file || !window.tinymce || !editor) return;
      try {
        const path = await uploadDebunkEditorImage(file);
        editor.insertContent(debunkInsertedImageHtml(path));
      } catch (err) {
        console.error(err);
        alert(err.message || String(err));
      }
    });
  }

  const form = document.querySelector("#configForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (window.tinymce) tinymce.triggerSave();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    //
    let solutionArr = [];
    let solutionDebunkBoxes = [];
    let benefitArr = [];
    let testimonialArr = [];
    let faqArr = [];
    let safetyNoticeBoxes = [];
    let comparisonTableRows = [];
    let medicalProofBoxes = [];
    let howtouseCardArr = [];
    let howtouseGuideArr = [];
    document
      .querySelectorAll("#howtouse_cards_wrapper .instance")
      .forEach((el) => {
        let htuCard = {
          img_url: el.querySelector('[name="how_to_use_img_url"]').value,
          title: el.querySelector('[name="title"]').value,
          desc: el.querySelector('[name="desc"]').value,
        };
        howtouseCardArr.push(htuCard);
      });
    document
      .querySelectorAll("#howtouse_guide_wrapper .instance")
      .forEach((el) => {
        let htuGuide = {
          minute: el.querySelector('[name="minute"]').value,
          desc: el.querySelector('[name="desc"]').value,
        };
        howtouseGuideArr.push(htuGuide);
      });
    //---
    //
    document.querySelectorAll("#faq_wrapper .instance").forEach((el) => {
      let faq = {
        question: el.querySelector('[name="question"]').value,
        anwser: el.querySelector('[name="anwser"]').value,
      };
      faqArr.push(faq);
    });
    document
      .querySelectorAll("#safety_notice_wrapper .instance")
      .forEach((el) => {
        const box = {
          title: el.querySelector('[name="safety_title"]').value,
          content: el.querySelector('[name="safety_content"]').value,
        };
        if (box.title || box.content) safetyNoticeBoxes.push(box);
      });
    document
      .querySelectorAll("#comparison_table_wrapper .instance")
      .forEach((el) => {
        const row = {
          label: el.querySelector('[name="comparison_row_label"]').value,
          cells: Array.from(el.querySelectorAll('[name="comparison_cell"]')).map(
            (input) => input.value,
          ),
        };
        if (row.label || row.cells.some(Boolean)) comparisonTableRows.push(row);
      });
    document
      .querySelectorAll("#medical_proof_wrapper .instance")
      .forEach((el) => {
        const box = {
          title: el.querySelector('[name="medical_proof_box_title"]').value,
          content: el.querySelector('[name="medical_proof_box_content"]').value,
        };
        if (box.title || box.content) medicalProofBoxes.push(box);
      });
    //-----
    document
      .querySelectorAll("#testimonial_wrapper .instance")
      .forEach((el) => {
        let t = {
          icon: el.querySelector('[name="icon"]').value,
          title: el.querySelector('[name="title"]').value,
          desc: el.querySelector('[name="desc"]').value,
        };
        testimonialArr.push(t);
      });
    document.querySelectorAll("#solution_wrapper .instance").forEach((el) => {
      let s = {
        icon: el.querySelector('[name="icon"]').value,
        title: el.querySelector('[name="title"]').value,
        desc: el.querySelector('[name="desc"]').value,
      };
      solutionArr.push(s);
    });
    document
      .querySelectorAll("#solution_debunk_wrapper .instance")
      .forEach((el) => {
        const box = {
          title: el.querySelector('[name="debunk_title"]').value,
          content: el.querySelector('[name="debunk_content"]').value,
        };
        if (box.title || box.content) solutionDebunkBoxes.push(box);
      });
    //
    document.querySelectorAll("#benefit_wrapper .instance").forEach((el) => {
      let b = {
        img_url: el.querySelector('[name="img_url"]').value,
        icon: el.querySelector('[name="icon"]').value,
        title: el.querySelector('[name="title"]').value,
        desc: el.querySelector('[name="desc"]').value,
      };
      benefitArr.push(b);
    });
    //
    data.faq_list = faqArr;
    data.safety_notice_boxes = safetyNoticeBoxes;
    data.comparison_table_columns = Array.from(
      document.querySelectorAll('[name="comparison_table_column"]'),
    )
      .map((input) => input.value.trim());
    data.comparison_table_rows = comparisonTableRows;
    data.medical_proof_boxes = medicalProofBoxes;
    data.testimonials = testimonialArr;
    data.solution_cards = solutionArr;
    data.solution_debunk_boxes = solutionDebunkBoxes;
    data.benefit_cards = benefitArr;
    data.how_to_use_cards = howtouseCardArr;
    data.how_to_use_guide = howtouseGuideArr;

    //
    let benefitFooterCardSolution = [];
    if (document.querySelector("#benefit_footer_solution").value) {
      benefitFooterCardSolution = document
        .querySelector("#benefit_footer_solution")
        .value.split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== "");
    }
    data.benefit_footer_card = {
      img_url: document.querySelector("#benefit_footer_img_url").value,
      lable: document.querySelector("#benefit_footer_title").value,
      solution: benefitFooterCardSolution,
    };
    //convert textarea(target_user) -> array
    if (document.querySelector("#target_user_list")) {
      data.target_user_list = document
        .querySelector("#target_user_list")
        .value.split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== "");
    }
    //convert textarea -> array
    if (data["issue_issues"]) {
      data["issue_issues"] = data["issue_issues"]
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== "");
    }
    console.log(data);
    submitForm(data);
  });
  //
  async function submitForm(data) {
    fetch("/admin/page-config/create-update", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        alert("update success");
      })
      .catch((err) => {
        (console.log(err), alert("update failed"));
      });
  }
});
const solutionTemplate = document.querySelector("#solution_template");
const solutionWrapper = document.querySelector("#solution_wrapper");
document.querySelector("#cta_add_solution_card")?.addEventListener("click", () => {
  if (!solutionTemplate || !solutionWrapper) return;
  const clone = solutionTemplate.content.cloneNode(true);
  solutionWrapper.appendChild(clone);
});
solutionWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-item")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
const solutionDebunkTemplate = document.querySelector("#solution_debunk_template");
const solutionDebunkWrapper = document.querySelector("#solution_debunk_wrapper");
document.querySelector("#cta_add_solution_debunk_box")?.addEventListener("click", () => {
  if (!solutionDebunkTemplate || !solutionDebunkWrapper) return;
  const clone = solutionDebunkTemplate.content.cloneNode(true);
  solutionDebunkWrapper.appendChild(clone);
  initTinyEditors(solutionDebunkWrapper);
});
solutionDebunkWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    removeTinyEditors(instance);
    instance.remove();
  }
});
//----------benefit
const benefitWrapper = document.querySelector("#benefit_wrapper");
document.querySelector("#cta_add_benefit_card")?.addEventListener("click", (ev) => {
  if (!benefitWrapper) return;
  const clone = document
    .querySelector("#benefit_template")
    .content.cloneNode(true);
  benefitWrapper.appendChild(clone);
});
document.querySelector("#benefit_wrapper")?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
// ------------- testimonial ------------
const testimonialWrapper = document.querySelector("#testimonial_wrapper");
document.querySelector("#cta_add_testimonial")?.addEventListener("click", (ev) => {
  if (!testimonialWrapper) return;
  const clone = document
    .querySelector("#testimonial_template")
    .content.cloneNode(true);
  testimonialWrapper.appendChild(clone);
});
testimonialWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
// -------------- faq ----------------
const safetyNoticeWrapper = document.querySelector("#safety_notice_wrapper");
const safetyNoticeTemplate = document.querySelector("#safety_notice_template");
document.querySelector("#cta_add_safety_box")?.addEventListener("click", () => {
  if (!safetyNoticeTemplate || !safetyNoticeWrapper) return;
  const clone = safetyNoticeTemplate.content.cloneNode(true);
  safetyNoticeWrapper.appendChild(clone);
  initTinyEditors(safetyNoticeWrapper);
});
safetyNoticeWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    removeTinyEditors(instance);
    instance.remove();
  }
});
// -------------- faq ----------------
const comparisonTableWrapper = document.querySelector("#comparison_table_wrapper");
const comparisonTableRowTemplate = document.querySelector("#comparison_table_row_template");
document.querySelector("#cta_add_comparison_row")?.addEventListener("click", () => {
  if (!comparisonTableRowTemplate || !comparisonTableWrapper) return;
  const clone = comparisonTableRowTemplate.content.cloneNode(true);
  comparisonTableWrapper.appendChild(clone);
});
comparisonTableWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});

const medicalProofWrapper = document.querySelector("#medical_proof_wrapper");
const medicalProofTemplate = document.querySelector("#medical_proof_template");
document.querySelector("#cta_add_medical_proof_box")?.addEventListener("click", () => {
  if (!medicalProofTemplate || !medicalProofWrapper) return;
  const clone = medicalProofTemplate.content.cloneNode(true);
  medicalProofWrapper.appendChild(clone);
  initTinyEditors(medicalProofWrapper);
});
medicalProofWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    removeTinyEditors(instance);
    instance.remove();
  }
});
// -------------- faq ----------------
const faq_wrapper = document.querySelector("#faq_wrapper");
const faq_template = document.querySelector("#faq_template");
document.querySelector("#cta_add_faq_card")?.addEventListener("click", (ev) => {
  if (!faq_template || !faq_wrapper) return;
  const clone = faq_template.content.cloneNode(true);
  faq_wrapper.appendChild(clone);
});
faq_wrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//
const howToUseWrapper = document.querySelector("#howtouse_cards_wrapper");
const howToUseTemplate = document.querySelector("#howtouse_template");
const howToUseGuideWrapper = document.querySelector("#howtouse_guide_wrapper");
const howToUseGuideTemplate = document.querySelector(
  "#howtouse_guide_template",
);

document.querySelector("#cta_add_howtouse_add_card")?.addEventListener("click", (ev) => {
  if (!howToUseTemplate || !howToUseWrapper) return;
  const clone = howToUseTemplate.content.cloneNode(true);
  howToUseWrapper.appendChild(clone);
});
howToUseWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//
document.querySelector("#cta_howtouse_guide_add_card")?.addEventListener("click", (ev) => {
  if (!howToUseGuideTemplate || !howToUseGuideWrapper) return;
  const clone = howToUseGuideTemplate.content.cloneNode(true);
  howToUseGuideWrapper.appendChild(clone);
});
howToUseGuideWrapper?.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//
// combo choose image (gallery picker)
const chooseImgModal = document.querySelector("#gallery_modal");
const imgListEl = document.getElementById("imgList");
//   var ctaChooseImg = document.querySelectorAll("#banner_wrapper");
let imgInputIsFocusing = null;
function openChooseImgModal() {
  if (!chooseImgModal) {
    console.error("[pageconfig] #gallery_modal not found");
    return;
  }
  if (!window.coreui || !window.coreui.Modal) {
    console.error("[pageconfig] CoreUI Modal not loaded (check layout scripts)");
    alert("Không mở được modal chọn ảnh — thử tải lại trang.");
    return;
  }
  coreui.Modal.getOrCreateInstance(chooseImgModal).show();
}
function closeChooseImgModal() {
  if (!chooseImgModal || !window.coreui?.Modal) return;
  coreui.Modal.getOrCreateInstance(chooseImgModal).hide();
}
//
function selectImage(src) {
  if (!imgInputIsFocusing) return;
  const input = imgInputIsFocusing.querySelector(".img_input");
  const preview = imgInputIsFocusing.querySelector(".img_preview img");
  if (input) input.value = src;
  if (preview) preview.src = src.startsWith("/") ? src : "/" + src;
  closeChooseImgModal();
}
//
function loadImage() {
  if (!imgListEl) {
    console.error('[pageconfig] #imgList not found inside #gallery_modal');
    return;
  }
  imgListEl.innerHTML = "Loading...";
  if (typeof $ === "undefined" || typeof $.ajax !== "function") {
    imgListEl.textContent =
      "Lỗi: jQuery chưa load (kiểm tra /libs/js/jquery trên server).";
    console.error("[pageconfig] jQuery missing");
    return;
  }
  $.ajax({
    url: "/admin/gallery/image-getall",
    method: "GET",
    success: (res) => {
      if (res.success && Array.isArray(res.data)) {
        imgListEl.innerHTML = "";
        res.data.forEach((item) => {
          const col = document.createElement("div");
          col.className = "col";

          const img = document.createElement("img");
          const pth = item.path || "";
          img.src = pth.startsWith("/") ? pth : "/" + pth;
          img.className = "admin-gallery-picker-img w-100 cursor-pointer rounded border";
          img.onclick = () => selectImage(item.path);

          col.appendChild(img);
          imgListEl.appendChild(col);
        });
      }
    },
    error: (xhr, status, err) =>
      console.log(xhr.responseJSON?.mess || "Server error"),
  });
}
//
//Tuy bien
document.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".chooseImg");
  if (!btn) return;

  imgInputIsFocusing = btn.closest(".image_action");
  openChooseImgModal();
  loadImage();
});
