if (document.getElementById("menu-icon")){
  var coll = document.getElementById("menu-icon").addEventListener("click", function() {
    var content = document.getElementById("menu-content")
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    };
  });
};

function storedTypes(){
  return localStorage.getItem("types");
};

function popUpDetails(){
  setTimeout(function() {
    if (document.location.hash !== ""){
      document.getElementById("iterContent").classList.remove("my-designs-inner");
      document.getElementById("iterContent").innerHTML = templateAfter();

      if (document.getElementsByClassName("project-inner").length > 0){
        document.getElementById("iterContent").onload = rollUp();
      };
    };
  }, 0.5);  
};

function rollUp(){
  window.scrollTo(0, 0);
}

function featureProjects(){
  let $iterProductFeatureContent = document.getElementById("iterProductFeatureProjects");
  let $iterMMFeatureProjects = document.getElementById("iterMMFeatureProjects");
  if ($iterProductFeatureContent !== null){
    projects.forEach(function(project) {
      if (project.feature == "yes"){
        let featureProjectsTemplate = document.getElementById("featureProjectsTemplate").innerHTML;
        for (let i=0; i<2; i++){
        featureProjectsTemplate = featureProjectsTemplate.replace("{meta}", project.meta);
        }
        featureProjectsTemplate = featureProjectsTemplate.replace("{name}", project.name);
        featureProjectsTemplate = featureProjectsTemplate.replace("{type}", project.type);
        featureProjectsTemplate = featureProjectsTemplate.replace("{description}", project.description);
        featureProjectsTemplate = featureProjectsTemplate.replace("{link}", project.link);

        div = document.createElement('div');
        div.classList.add("my-design");
        div.classList.add("col-sm-6");
        div.classList.add("col-md-4")
        div.innerHTML = featureProjectsTemplate;
        if (project.type == "product-design") {
          $iterProductFeatureContent.appendChild(div);
        } else {
          $iterMMFeatureProjects.appendChild(div);
        }
      };
    });
  };
};

function templateBefore(types){
  // check if projects is loaded
  if (typeof projects !== 'undefined'){
    let $iterContent = document.getElementById("iterContent");
    if ($iterContent !== null){
      types = storedTypes();

      // NEW: Keep the URL perfectly in sync with the current filter!
      if (types) {
        const currentUrlParams = new URLSearchParams(window.location.search);
        const currentCat = currentUrlParams.get('category');
        
        // If the URL doesn't match the active filter, update the address bar quietly
        if (currentCat !== types && !(types === 'all' && !currentCat)) {
          let newUrl = window.location.pathname;
          if (types !== 'all') {
            newUrl += '?category=' + types;
          }
          newUrl += window.location.hash;
          window.history.replaceState(null, '', newUrl); // Changes URL without reloading!
        }
      }

      // make sure div is empty to start
      $iterContent.innerHTML = "";
      $iterContent.classList.add("my-designs-inner")

      // filter types
      let uiuxFilterText = 'UI/UX DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let productDesignFilterText = 'PRODUCT DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let mulitmediaDesignFilterText = 'MULTIMEDIA DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let allDesignFilterText = 'MY DESIGNS <i class="fa-solid fa-chevron-down"></i>';

      projects.forEach(function(project) {
        if (types === "product"){
          document.getElementById("dropdownMenuButton").innerHTML = productDesignFilterText
          if (project.type !== "product-design"){
            return;
          };
        } else if (types === "multimedia"){
          document.getElementById("dropdownMenuButton").innerHTML = mulitmediaDesignFilterText
          if (project.type !== "multimedia-design"){
            return;
          };
        } else if (types === "uiux"){
          document.getElementById("dropdownMenuButton").innerHTML = uiuxFilterText
          if (project.type !== "uiux"){
            return;
          };
        } else if (types === "all"){
          document.getElementById("dropdownMenuButton").innerHTML = allDesignFilterText
        };
        
        let template = document.getElementById("my-template").innerHTML;
        for (let i=0; i<2; i++){
        template = template.replace("{meta}", project.meta);
        }
        template = template.replace("{name}", project.name);
        template = template.replace("{type}", project.type);
        template = template.replace("{description}", project.description);
        template = template.replace("{link}", project.link);

        div = document.createElement('div');
        div.classList.add("my-design");
        div.classList.add("col-sm-6");
        div.classList.add("col-md-4")
        div.innerHTML = template;
        document.getElementById("iterContent").appendChild(div);
      });
    };
  };
};

function templateAfter() {
  let newDiv = "";
  projects.forEach(function (project) {
    if (document.location.hash === `#${project.meta}`) {
      newDiv = `
      <div class="project-inner ${project.meta}">
        <img class="project-hero-img" src="my-designs/${project.meta}.jpg" alt="${project.name} hero">
        <h1>${project.name}</h1>
        <p class="info"><em>${project.description} project for ${project.for}</em></p>`;

      if (typeof project.download !== "undefined") {
        newDiv += `<button class="button secondary-button my-4" onclick="window.open('${project.download}')">${project.downloadText}</button>`;
      }

      if (project.innerDescription) {
        project.innerDescription.forEach(function (section) {
          newDiv += `<section class="project-section">`;

          if (section.title && section.title.trim() !== "") {
            newDiv += `<h3>${section.title}</h3>`;
          }

          if (typeof section.description === "string") {
            newDiv += `<p>${section.description}</p>`;
          } else if (Array.isArray(section.description)) {
            section.description.forEach(function (para) {
              newDiv += `<p>${para}</p>`;
            });
          }

          if (Array.isArray(section.images) && section.images.length > 0) {
            section.images.forEach(function (idx) {
              newDiv += `<img class="project-img" src="my-designs/${project.meta}-${idx}.jpg" alt="${project.name} image ${idx}" loading="lazy">`;
            });
          }

          if (Array.isArray(section.gifs) && section.gifs.length > 0) {
            section.gifs.forEach(function (idx) {
              newDiv += `<img class="project-img" src="my-designs/${project.meta}-${idx}.gif" alt="${project.name} gif ${idx}" loading="lazy">`;
            });
          }

          if (Array.isArray(section.videos) && section.videos.length > 0) {
            section.videos.forEach(function (videoIdx) {
              if (project.video && project.video[videoIdx]) {
                newDiv += `<div class="iframe-container"><iframe class="responsive-iframe" ${project.video[videoIdx]}></iframe></div>`;
              }
            });
          }

          newDiv += `</section>`;
        });
      }

      const usedImages = new Set();
      if (project.innerDescription) {
        project.innerDescription.forEach(sec => {
          if (sec.images) sec.images.forEach(i => usedImages.add(i));
        });
      }
      if (project.img && usedImages.size < project.img) {
        newDiv += `<div class="project-gallery">`;
        for (let i = 1; i <= project.img; i++) {
          if (!usedImages.has(i)) {
            newDiv += `<img class="project-img" src="my-designs/${project.meta}-${i}.jpg" alt="${project.name} additional image ${i}" loading="lazy">`;
          }
        }
        newDiv += `</div>`;
      }

      const usedGifs = new Set();
      if (project.innerDescription) {
        project.innerDescription.forEach(sec => {
          if (sec.gifs) sec.gifs.forEach(i => usedGifs.add(i));
        });
      }

      if (project.gif && project.gif > 0) {
        let hasUnassignedGifs = false;
        for (let i = 1; i <= project.gif; i++) {
          if (!usedGifs.has(i)) {
            hasUnassignedGifs = true;
            break;
          }
        }

        if (hasUnassignedGifs) {
          newDiv += `<div class="project-gif-gallery mt-5">`;
          for (let i = 1; i <= project.gif; i++) {
            if (!usedGifs.has(i)) {
              newDiv += `<img class="project-img project-gif" 
                             src="my-designs/${project.meta}-${i}.gif" 
                             alt="${project.name} animation ${i}" 
                             loading="lazy">`;
            }
          }
          newDiv += `</div>`;
        }
      }

      const usedVideos = new Set();
      if (project.innerDescription) {
        project.innerDescription.forEach(sec => {
          if (sec.videos) sec.videos.forEach(i => usedVideos.add(i));
        });
      }

      if (project.video && project.video.length > 0) {
        let hasUnassigned = false;
        for (let i = 0; i < project.video.length; i++) {
          if (!usedVideos.has(i)) {
            hasUnassigned = true;
            break;
          }
        }

        if (hasUnassigned) {
          newDiv += `<div class="project-video-gallery mt-5">`;
          newDiv += `<h3 class="text-center mb-4">Project Videos</h3>`;
          project.video.forEach(function (videoAttr, idx) {
            if (!usedVideos.has(idx)) {
              newDiv += `<div class="iframe-container mb-4">
                <iframe class="responsive-iframe" ${videoAttr}></iframe>
              </div>`;
            }
          });
          newDiv += `</div>`;
        }
      }

      newDiv += `
        <p class="text-center published">@ ${project.published}</p>
        <button class="project-inner-close project-close-top" onclick="closeProject()"><i class="fa-solid fa-xmark"></i></button> 
      </div>`;
    }
  });

  if (newDiv === "") {
    newDiv = "<p>No project found.</p>";
  }

  document.getElementsByClassName("inner-header-container")[0].classList.add("hide");
  document.getElementsByClassName("design-filter")[0].classList.add("hide");
  return newDiv;
}

function toggleDropdown(){
  document.getElementById("dropdown-menu").classList.toggle("show");
};

function setStore(types){
  localStorage.setItem("types", types);
};

function backToDesigns(){
  document.getElementsByClassName("inner-header-container")[0].classList.remove("hide");
  document.getElementsByClassName("design-filter")[0].classList.remove("hide");
  if (document.getElementsByClassName("project-inner").length !== 0){
    let currentHash = document.getElementsByClassName("project-inner")[0].classList[1]
    setTimeout(function() {
      if (document.location.hash == "" || document.location.hash !== currentHash){
        templateBefore(); 
      };
    }, 0.8);
  };
};

function closeProject(){
  let projectContent = document.getElementsByClassName("project-inner")[0];
  
  function closeProjectAnimation(){
    projectContent.style.transform = "translateY(600px)";
    projectContent.style.transition = "transform 0.2s";
  };
  
  function closeProjectDiv() {
    let previousPage = document.referrer;
    
    if (!previousPage.includes("francispun.com") || previousPage === ""){
      const currentUrlParams = new URLSearchParams(window.location.search);
      const currentCat = currentUrlParams.get('category');
      
      let returnUrl = window.location.pathname; 
      
      if (currentCat) {
        returnUrl += '?category=' + currentCat;
      }
      
      window.location.href = returnUrl;
      
    } else {
      history.back();
    };
  };

  closeProjectAnimation();
  setTimeout(closeProjectDiv, 150);
};

if(document.location.href.includes("my-designs")){
  window.addEventListener('scroll', (e) => {
    let toTopButton = document.getElementsByClassName("to-top")[0]
    if (window.scrollY > 110) {
      toTopButton.style.display = "block";
    } else if (window.scrollY < 110) {
      toTopButton.style.display = "none";
    }
  });
};

window.addEventListener('popstate', backToDesigns);

window.addEventListener('click', function(e) {
  if (e.target.id !== "dropdownMenuButton"){
    if (document.getElementById("dropdown-menu")){
      if (document.getElementById("dropdown-menu").classList.value === "show"){
        toggleDropdown();
      };
    };
  };
});

// ==========================================
// INITIAL PAGE RENDER & URL PARAMETER LOGIC
// ==========================================

featureProjects();

// 1. Check the URL for parameters
const urlParams = new URLSearchParams(window.location.search);
let category = urlParams.get('category');

// Edge-case fix: If someone accidentally appends the category after a project hash (#meta?category=uiux)
if (!category && window.location.hash.includes('?category=')) {
  const hashQuery = window.location.hash.split('?')[1];
  const hashParams = new URLSearchParams('?' + hashQuery);
  category = hashParams.get('category');
}

// 2. Decide what filter to apply based on the URL
if (category) {
  category = category.toLowerCase(); // Converts ?category=UIUX to uiux so it doesn't break
  const validCategories = ['all', 'product', 'uiux', 'multimedia'];
  if (validCategories.includes(category)) {
    setStore(category); 
  }
} else {
  // If there is NO category in the URL (like clicking your main header link),
  // reset to "all" to wipe the memory so you don't get trapped.
  setStore('all');
}

// 3. Render the page
templateBefore();
popUpDetails();
