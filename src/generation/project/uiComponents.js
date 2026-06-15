import { svgs } from '../../assets/icons/svg/svg.js';

/**
 * Creates a reusable Custom Dropdown
 * @param {Array} options - Array of objects { value, label }
 * @param {String} selectedValue - Default selected value
 * @param {Function} onChange - Callback (value) => {}
 * @returns {HTMLElement} The dropdown container
 */
export function createCustomSelect(options, selectedValue, onChange) {
  const container = document.createElement('div');
  container.className = 'custom-select-container'; 

  const initialOption = options.find(o => o.value === selectedValue) || options[0];
  let currentValue = initialOption.value;

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  trigger.innerHTML = `
    <span class="selected-text">${initialOption.label}</span>
    <span class="arrow-icon" style="opacity: 0.7;">${svgs.arrowDown}</span>
  `;

  const optionsList = document.createElement('div');
  optionsList.className = 'custom-select-options';

  function renderOptions() {
    optionsList.innerHTML = '';
    options.forEach(opt => {
      const optEl = document.createElement('div');
      optEl.className = `custom-option ${opt.value === currentValue ? 'selected' : ''}`;
      optEl.textContent = opt.label;
      
      optEl.onclick = (e) => {
        e.stopPropagation();
        currentValue = opt.value;
        trigger.querySelector('.selected-text').textContent = opt.label;
        
        container.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
        optEl.classList.add('selected');

        optionsList.classList.remove('open');
        trigger.classList.remove('active');
        
        if(onChange) onChange(currentValue);
      };
      
      optionsList.appendChild(optEl);
    });
  }

  renderOptions();

  trigger.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-select-options.open').forEach(el => {
      if(el !== optionsList) el.classList.remove('open');
    });

    optionsList.classList.toggle('open');
    trigger.classList.toggle('active');
  };

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      optionsList.classList.remove('open');
      trigger.classList.remove('active');
    }
  });

  container.appendChild(trigger);
  container.appendChild(optionsList);

  container.getValue = () => currentValue;

  return container;
}