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
        // get template from tag
        let featureProjectsTemplate = document.getElementById("featureProjectsTemplate").innerHTML;
        // replace placeholders with values from project object
        for (let i=0; i<2; i++){
        featureProjectsTemplate = featureProjectsTemplate.replace("{meta}", project.meta);
        }
        featureProjectsTemplate = featureProjectsTemplate.replace("{name}", project.name);
        featureProjectsTemplate = featureProjectsTemplate.replace("{type}", project.type);
        featureProjectsTemplate = featureProjectsTemplate.replace("{description}", project.description);
        featureProjectsTemplate = featureProjectsTemplate.replace("{link}", project.link);

        // add to the list
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
    //check if $iterContent div exist
    let $iterContent = document.getElementById("iterContent");
    if ($iterContent !== null){
      types = storedTypes();

      // make sure div is empty to start
      $iterContent.innerHTML = "";
      $iterContent.classList.add("my-designs-inner")

      // filter types
      let uiuxFilterText = 'UI/UX DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let productDesignFilterText = 'PRODUCT DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let mulitmediaDesignFilterText = 'MULTIMEDIA DESIGNS <i class="fa-solid fa-chevron-down"></i>';
      let allDesignFilterText = 'MY DESIGNS <i class="fa-solid fa-chevron-down"></i>';

      // loop through the project array and append each list item
      // check the "types" from storage or button action
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
        // get template from tag
        let template = document.getElementById("my-template").innerHTML;

        // replace placeholders with values from project object
        for (let i=0; i<2; i++){
        template = template.replace("{meta}", project.meta);
        }
        template = template.replace("{name}", project.name);
        template = template.replace("{type}", project.type);
        template = template.replace("{description}", project.description);
        template = template.replace("{link}", project.link);

        // add to the list
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
      <img class="project-hero-img" src="my-designs/${project.meta}.jpg">
      <h1>${project.name}</h1>
      <p class="info"><em>The ${project.description} project of ${project.for}</em></p>`;

      project.innerDescription.forEach(function (description) {
        if (typeof description === "object") {
          newDiv += `
          <h3>${description.title}</h3>`;
          if (Array.isArray(description.description)) {
            description.description.forEach(function (desc) {
              newDiv += `<p>${desc}</p>`;
            });
          } else {
            newDiv += `<p>${description.description}</p>`;
          }
        } else {
          newDiv += `<p>${description}</p>`;
        }
      });

      if (typeof project.gif !== "undefined") {
        for (let i = 0; i < project.gif; i++) {
          newDiv += `<img class="project-img" src="my-designs/${project.meta}-${i + 1}.gif">`;
        }
      }

      if (typeof project.download !== "undefined") {
        newDiv += `<button class="button secondary-button my-4" onclick="window.open('${project.download}')">${project.downloadText}</button>`;
      }

      if (typeof project.video !== "undefined") {
        project.video.forEach(function (eachVideo) {
          newDiv += `<div class="iframe-container"> <iframe class="responsive-iframe" ${eachVideo}></iframe></div>`;
        });
      }

      for (let i = 0; i < project.img; i++) {
        newDiv += `<img class="project-img" src="my-designs/${project.meta}-${i + 1}.jpg">`;
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
        templateBefore(storedTypes);
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
    let previousPage = document.referrer
    if (previousPage.includes(!"francispun.com") || previousPage == ""){
      location.href="https://www.francispun.com"
    }else{
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


featureProjects();
templateBefore();
popUpDetails();
