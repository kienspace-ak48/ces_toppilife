function toggleSection(id) {
  const el = document.querySelector("#" + id);
  el.classList.toggle("hidden");
}
document.querySelectorAll("section > div").forEach((el) => {
  el.classList.toggle("hidden");
});
//
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#configForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    //
    let solutionArr = [];
    let benefitArr = [];
    let testimonialArr = [];
    let faqArr = [];
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
    data.testimonials = testimonialArr;
    data.solution_cards = solutionArr;
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
document
  .querySelector("#cta_add_solution_card")
  .addEventListener("click", () => {
    const clone = solutionTemplate.content.cloneNode(true);
    solutionWrapper.appendChild(clone);
  });
solutionWrapper.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-item")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//----------benefit
const benefitWrapper = document.querySelector("#benefit_wrapper");
document
  .querySelector("#cta_add_benefit_card")
  .addEventListener("click", (ev) => {
    const clone = document
      .querySelector("#benefit_template")
      .content.cloneNode(true);
    benefitWrapper.appendChild(clone);
  });
document.querySelector("#benefit_wrapper").addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
// ------------- testimonial ------------
const testimonialWrapper = document.querySelector("#testimonial_wrapper");
document
  .querySelector("#cta_add_testimonial")
  .addEventListener("click", (ev) => {
    const clone = document
      .querySelector("#testimonial_template")
      .content.cloneNode(true);
    testimonialWrapper.appendChild(clone);
  });
testimonialWrapper.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
// -------------- faq ----------------
const faq_wrapper = document.querySelector("#faq_wrapper");
const faq_template = document.querySelector("#faq_template");
document.querySelector("#cta_add_faq_card").addEventListener("click", (ev) => {
  const clone = faq_template.content.cloneNode(true);
  faq_wrapper.appendChild(clone);
});
faq_wrapper.addEventListener("click", (ev) => {
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

document
  .querySelector("#cta_add_howtouse_add_card")
  .addEventListener("click", (ev) => {
    const clone = howToUseTemplate.content.cloneNode(true);
    howToUseWrapper.appendChild(clone);
  });
howToUseWrapper.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//
document
  .querySelector("#cta_howtouse_guide_add_card")
  .addEventListener("click", (ev) => {
    const clone = howToUseGuideTemplate.content.cloneNode(true);
    howToUseGuideWrapper.appendChild(clone);
  });
howToUseGuideWrapper.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("remove-instance")) {
    const instance = ev.target.closest(".instance");
    instance.remove();
  }
});
//
// combo choose image
const chooseImgModal = document.querySelector("#gallery_modal");
//   var ctaChooseImg = document.querySelectorAll("#banner_wrapper");
let imgInputIsFocusing = null;
function openChooseImgModal() {
  chooseImgModal.classList.remove("hidden");
  chooseImgModal.classList.add("flex");
}
function closeChooseImgModal() {
  chooseImgModal.classList.remove("flex");
  chooseImgModal.classList.add("hidden");
}
//
function selectImage(src) {
  imgInputIsFocusing.querySelector(".img_input").value = src;
  imgInputIsFocusing.querySelector(".img_preview img").src = "/" + src;
  closeChooseImgModal();
}
//
function loadImage() {
  imgList.innerHTML = "Loading...";
  $.ajax({
    url: "/admin/gallery/image-getall",
    method: "GET",
    success: (res) => {
      if (res.success) {
        imgList.innerHTML = "";
        res.data.forEach((item) => {
          const img = document.createElement("img");
          img.src = "/" + item.path;
          img.className = `
            w-full h-32
            object-cover
            cursor-pointer rounded border
            hover:ring-4 hover:ring-blue-500
            transition
          `;

          img.onclick = () => selectImage(item.path);

          imgList.appendChild(img);
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

  loadImage();
  imgInputIsFocusing = btn.closest(".image_action");
  openChooseImgModal();
});
