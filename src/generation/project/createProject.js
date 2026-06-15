import { assets } from '../../assets/assets.js';
import { renderConfigureScreen } from './configureProject.js'; 
import androidSpy from '../../assets/icons/png/android_spy.png'; 
import androidSpyAngry from  '../../assets/icons/png/android_spy_angry.png';

const templateList = [
  { name: 'No Activity', img: assets.templates.noActivity, id: 'no_activity' },
  { name: 'Empty Activity', img: assets.templates.emptyActivity, id: 'empty_activity' },
  { name: 'Basic View', img: assets.templates.basicActivity, id: 'basic_activity' },
  { name: 'Bottom Nav', img: assets.templates.bottomNavActivity, id: 'bottom_nav' },
  { name: 'Nav Drawer', img: assets.templates.navDrawerActivity, id: 'nav_drawer' },
  { name: 'Tabbed Activity', img: assets.templates.tabbedActivity, id: 'tabbed_activity' },
  { name: 'Map Activity', img: assets.templates.mapActivity, id: 'map_activity' },
  { name: 'Empty Compose', img: assets.templates.emptyComposeActivity, id: 'compose_empty' },
  // NEW : =================
  { name: 'Settings Views', img: assets.templates.settingsViews, id: 'settings_views_activity' },
  { name: 'Scroll Activity', img: assets.templates.scrollActivity, id: 'scroll_activity' },
  { name: 'Login Views', img: assets.templates.loginViews, id: 'login_views_activity' },
  { name: 'Fullscreen Views', img: assets.templates.fullscreenViews, id: 'fullscreen_views_activity' },
  // =========================
  { name: 'Native C++', img: assets.templates.nativeCpp, id: 'native_cpp' },
];

/**
 * Renders the Choose Template Screen
 */
export function renderCreateProjectScreen($container, onBack) {
  $container.innerHTML = `
    <div class="andro-create-page">
      
      <img src="${androidSpy}" class="andro-spy-icon" id="spyIcon" alt="Android Spy">

      <div class="andro-create-header">
        <h2 class="andro-heading" style="margin-bottom: 5px; margin-left: 20px;">Choose Template</h2>
        <p style="opacity: 0.7; font-size: 0.9rem; margin-left: 20px;">Select a template to begin</p>
      </div>

      <div class="andro-template-grid" id="templateGrid"></div>

      <button class="back-btn" id="btn-back">← Go Back</button>
    </div>
  `;

  // === SPY ICON LOGIC ====
  const spyIcon = $container.querySelector('#spyIcon');
  let angerTimer; 

  spyIcon.onclick = () => {
    if (angerTimer) clearTimeout(angerTimer);

    spyIcon.src = androidSpyAngry;
    spyIcon.classList.add('angry');

    angerTimer = setTimeout(() => {
      spyIcon.src = androidSpy;       
      spyIcon.classList.remove('angry');
    }, 3500);
  };
  // =======================

  const $grid = $container.querySelector('#templateGrid');
  
  templateList.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'andro-template-card';
    card.innerHTML = `
      <img src="${tpl.img}" class="andro-template-img" alt="${tpl.name}">
      <span class="andro-template-name">${tpl.name}</span>
    `;
    
    card.onclick = () => {
      if(tpl.id === "native_cpp"){
        window.toast('Coming Soon ! Working on this ❤️');
        return;
      } 
      renderConfigureScreen(
        $container, 
        tpl, 
        () => renderCreateProjectScreen($container, onBack),
        onBack
      );
    };

    $grid.appendChild(card);
  });

  $container.querySelector('#btn-back').onclick = onBack;
}