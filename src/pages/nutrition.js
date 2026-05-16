/*
  Lógica funcional para el Registro de Nutrición - NutriFit Systems
  Búsqueda de alimentos simulada, registro con cantidades y cálculo
  automático de calorías, macronutrientes y 5 micronutrientes.
*/

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    //  BASE DE DATOS DE ALIMENTOS (Mock - Simula una BD real)
    //  Cada alimento tiene valores NUTRICIONALES por 100g
    //  Micros: Fibra, Sodio, Azúcar, Vitamina C, Hierro
    // ============================================================
    const FOOD_DATABASE = [
        {
            id: 'food-poll',
            name: 'Pechuga de Pollo',
            emoji: '🍗',
            per100: { kcal: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sodium: 74, sugar: 0, vitC: 0, iron: 1.0 }
        },
        {
            id: 'food-arroz',
            name: 'Arroz Blanco',
            emoji: '🍚',
            per100: { kcal: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sodium: 1, sugar: 0.1, vitC: 0, iron: 0.2 }
        },
        {
            id: 'food-aguacate',
            name: 'Aguacate',
            emoji: '🥑',
            per100: { kcal: 160, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7, sodium: 7, sugar: 0.7, vitC: 10, iron: 0.6 }
        },
        {
            id: 'food-huevos',
            name: 'Huevos Revueltos',
            emoji: '🍳',
            per100: { kcal: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0, sodium: 124, sugar: 1.1, vitC: 0, iron: 1.8 }
        },
        {
            id: 'food-brocoli',
            name: 'Brócoli',
            emoji: '🥦',
            per100: { kcal: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, sodium: 33, sugar: 1.7, vitC: 89, iron: 0.7 }
        },
        {
            id: 'food-salmon',
            name: 'Salmón Ahumado',
            emoji: '🐟',
            per100: { kcal: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, sodium: 59, sugar: 0, vitC: 0, iron: 0.3 }
        },
        {
            id: 'food-yogur',
            name: 'Yogur Griego',
            emoji: '🥛',
            per100: { kcal: 59, protein: 10, carbs: 3.6, fats: 0.7, fiber: 0, sodium: 36, sugar: 3.6, vitC: 0, iron: 0 }
        },
        {
            id: 'food-platano',
            name: 'Plátano',
            emoji: '🍌',
            per100: { kcal: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, sodium: 1, sugar: 12, vitC: 8.7, iron: 0.3 }
        }
    ];

    // Metas diarias del usuario
    const DAILY_GOALS = {
        kcal: 2500,
        protein: 160,
        carbs: 250,
        fats: 70
    };

    // ============================================================
    //  ESTADO DE LA APLICACIÓN
    // ============================================================
    const state = {
        currentDate: new Date(),
        activeMeal: null,
        editingFood: null,   // Objeto alimento mientras se elige cantidad
        meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        },
        water: {
            current: 1500,   // ml
            goal: 3000
        }
    };

    // ============================================================
    //  REFERENCIAS AL DOM
    // ============================================================
    const modal = document.getElementById('modal-food-search');
    const searchInput = document.getElementById('food-search-input');
    const searchResults = document.getElementById('search-results');
    const btnCloseModal = document.querySelector('.btn-close-modal');

    const calRemaining = document.getElementById('cal-remaining');
    const proteinTotal = document.getElementById('protein-total');
    const waterTotal = document.getElementById('water-total');

    const waterLevelBar = document.getElementById('water-level-bar');
    const waterCurrentSpan = document.querySelector('.water-stats .current');

    const currentDateSpan = document.getElementById('current-date');
    const btnPrevDay = document.getElementById('prev-day');
    const btnNextDay = document.getElementById('next-day');

    const btnAddFoods = document.querySelectorAll('.btn-add-food');
    const btnWaterBtns = document.querySelectorAll('.btn-water');

    // ============================================================
    //  FUNCIONES AUXILIARES
    // ============================================================

    // Calcula los nutrientes para una cantidad específica en gramos
    function calcNutrition(food, grams) {
        const r = grams / 100;
        return {
            kcal: Math.round(food.per100.kcal * r),
            protein: Math.round(food.per100.protein * r * 10) / 10,
            carbs: Math.round(food.per100.carbs * r * 10) / 10,
            fats: Math.round(food.per100.fats * r * 10) / 10,
            fiber: Math.round(food.per100.fiber * r * 10) / 10,
            sodium: Math.round(food.per100.sodium * r),
            sugar: Math.round(food.per100.sugar * r * 10) / 10,
            vitC: Math.round(food.per100.vitC * r * 10) / 10,
            iron: Math.round(food.per100.iron * r * 100) / 100
        };
    }

    // Formatea fecha
    function formatDate(date) {
        const opts = { weekday: 'long', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('es-ES', opts)
            .replace(/^(\w)/, c => c.toUpperCase());
    }

    // Suma una propiedad numérica en un array de items
    function sumProp(items, prop) {
        return items.reduce((acc, item) => acc + (item.calculated[prop] || 0), 0);
    }

    // Toast notification
    function showToast(message, icon) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${icon || 'ri-check-line'}"></i><span class="toast-text">${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ============================================================
    //  RENDER: ALIMENTOS EN UNA COMIDA
    // ============================================================

    function renderMealFoods(mealId) {
        const section = document.getElementById(mealId + '-section');
        if (!section) return;
        const content = section.querySelector('.meal-content');
        const footer = section.querySelector('.meal-footer');
        const items = state.meals[mealId] || [];

        // Limpiar contenido excepto el mensaje vacío
        const emptyMsg = content.querySelector('.empty-meal-msg');
        content.querySelectorAll('.food-item').forEach(el => el.remove());

        if (items.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
            items.forEach((entry, index) => {
                const div = document.createElement('div');
                div.className = 'food-item';
                div.dataset.index = index;
                div.innerHTML = `
                    <div class="food-info">
                        <div class="food-main-row">
                            <span class="food-emoji">${entry.food.emoji}</span>
                            <span class="food-name">${entry.food.name}</span>
                            <button class="food-remove" data-meal="${mealId}" data-index="${index}" title="Eliminar">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <span class="food-amount">${entry.grams}g</span>
                        <div class="food-micros">
                            <span>Fibra: ${entry.calculated.fiber}g</span>
                            <span>Sodio: ${entry.calculated.sodium}mg</span>
                            <span>Azúcar: ${entry.calculated.sugar}g</span>
                            <span>VitC: ${entry.calculated.vitC}mg</span>
                            <span>Hierro: ${entry.calculated.iron}mg</span>
                        </div>
                    </div>
                    <span class="food-kcal">${entry.calculated.kcal} kcal</span>
                `;
                content.appendChild(div);
            });
        }

        // Asignar eventos a los botones de eliminar
        content.querySelectorAll('.food-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const m = this.dataset.meal;
                const idx = parseInt(this.dataset.index);
                removeFood(m, idx);
            });
        });

        // Actualizar footer de macros
        updateMealFooter(mealId, items);
    }

    // ============================================================
    //  RENDER: FOOTER DE MACROS POR COMIDA
    // ============================================================

    function updateMealFooter(mealId, items) {
        const section = document.getElementById(mealId + '-section');
        if (!section) return;
        const footer = section.querySelector('.meal-footer');
        let microsContainer = section.querySelector('.meal-footer-micros');
        if (!microsContainer) {
            microsContainer = document.createElement('div');
            microsContainer.className = 'meal-footer-micros';
            footer.parentNode.insertBefore(microsContainer, footer.nextSibling);
        }

        const totalKcal = sumProp(items, 'kcal');
        const totalP = sumProp(items, 'protein');
        const totalC = sumProp(items, 'carbs');
        const totalF = sumProp(items, 'fats');
        const totalFiber = sumProp(items, 'fiber');
        const totalSodium = sumProp(items, 'sodium');
        const totalSugar = sumProp(items, 'sugar');
        const totalVitC = sumProp(items, 'vitC');
        const totalIron = sumProp(items, 'iron');

        // Actualizar pills de macros
        const pills = footer.querySelector('.meal-macros-summary');
        if (pills) {
            pills.innerHTML = `
                <span class="macro-pill kcal">${totalKcal} kcal</span>
                <span class="macro-pill p">${totalP}g P</span>
                <span class="macro-pill c">${totalC}g C</span>
                <span class="macro-pill f">${totalF}g G</span>
            `;
        }

        // Actualizar micros (crear o reusar)
        if (microsContainer) {
            microsContainer.innerHTML = `
                <span>🌾 Fibra: ${totalFiber}g</span>
                <span>🧂 Sodio: ${totalSodium}mg</span>
                <span>🍬 Azúcar: ${totalSugar}g</span>
                <span>🍊 Vit. C: ${totalVitC}mg</span>
                <span>🩸 Hierro: ${totalIron}mg</span>
            `;
        }
    }

    // ============================================================
    //  RENDER: ESTADÍSTICAS GLOBALES Y MACROS
    // ============================================================

    function recalculateAll() {
        // Recolectar todos los items de todas las comidas
        const allItems = Object.values(state.meals).flat();

        const totalKcal = sumProp(allItems, 'kcal');
        const totalProtein = sumProp(allItems, 'protein');
        const totalCarbs = sumProp(allItems, 'carbs');
        const totalFats = sumProp(allItems, 'fats');

        const remainingKcal = DAILY_GOALS.kcal - totalKcal;

        // Stats bar (consumido, no restante)
        if (calRemaining) {
            calRemaining.textContent = totalKcal.toLocaleString() + ' kcal';
        }
        const calProgress = document.getElementById('cal-progress');
        const calProgressText = calRemaining?.closest('.stat-mini-card')?.querySelector('.progress-text');
        if (calProgress) {
            const pct = Math.min(100, Math.round((totalKcal / DAILY_GOALS.kcal) * 100));
            calProgress.style.width = pct + '%';
            if (calProgressText) calProgressText.textContent = pct + '%';
        }
        if (proteinTotal) {
            proteinTotal.textContent = `${totalProtein}g / ${DAILY_GOALS.protein}g`;
        }
        if (waterTotal) {
            const liters = (state.water.current / 1000).toFixed(1);
            const goalL = (state.water.goal / 1000).toFixed(1);
            waterTotal.textContent = `${liters}L / ${goalL}L`;
        }

        // Barra de agua
        if (waterLevelBar) {
            const pct = Math.min(100, (state.water.current / state.water.goal) * 100);
            waterLevelBar.style.height = pct + '%';
        }
        if (waterCurrentSpan) {
            const liters = (state.water.current / 1000).toFixed(1);
            waterCurrentSpan.textContent = liters + 'L';
        }

        // Widget resumen de macros (progress bars) — sincronizado con stats bar
        const macroLabels = document.querySelectorAll('.macro-label');
        if (macroLabels.length >= 4) {
            // Calorías
            const kcalPct = Math.min(100, Math.round((totalKcal / DAILY_GOALS.kcal) * 100));
            macroLabels[0].innerHTML = `<span>Calorías</span><span>${totalKcal} kcal / ${DAILY_GOALS.kcal} kcal</span>`;
            const kcalBar = macroLabels[0].closest('.macro-item')?.querySelector('.progress-bar-fill');
            if (kcalBar) kcalBar.style.width = kcalPct + '%';

            // Proteína
            const pPct = Math.min(100, Math.round((totalProtein / DAILY_GOALS.protein) * 100));
            macroLabels[1].innerHTML = `<span>Proteína</span><span>${totalProtein}g / ${DAILY_GOALS.protein}g</span>`;
            const pBar = macroLabels[1].closest('.macro-item')?.querySelector('.progress-bar-fill');
            if (pBar) pBar.style.width = pPct + '%';

            // Carbs
            const cPct = Math.min(100, Math.round((totalCarbs / DAILY_GOALS.carbs) * 100));
            macroLabels[2].innerHTML = `<span>Carbohidratos</span><span>${totalCarbs}g / ${DAILY_GOALS.carbs}g</span>`;
            const cBar = macroLabels[2].closest('.macro-item')?.querySelector('.progress-bar-fill');
            if (cBar) cBar.style.width = cPct + '%';

            // Grasas
            const fPct = Math.min(100, Math.round((totalFats / DAILY_GOALS.fats) * 100));
            macroLabels[3].innerHTML = `<span>Grasas</span><span>${totalFats}g / ${DAILY_GOALS.fats}g</span>`;
            const fBar = macroLabels[3].closest('.macro-item')?.querySelector('.progress-bar-fill');
            if (fBar) fBar.style.width = fPct + '%';
        }

        // Guardar totales en localStorage para compartir con el dashboard
        try {
            localStorage.setItem('nutrifit-nutrition', JSON.stringify({
                kcal: totalKcal,
                protein: totalProtein,
                carbs: totalCarbs,
                fats: totalFats,
                water: state.water.current,
                waterGoal: state.water.goal,
                kcalGoal: DAILY_GOALS.kcal,
                proteinGoal: DAILY_GOALS.protein,
                carbsGoal: DAILY_GOALS.carbs,
                fatsGoal: DAILY_GOALS.fats
            }));
        } catch (e) { /* localStorage no disponible */ }
    }

    // ============================================================
    //  AÑADIR / ELIMINAR ALIMENTOS
    // ============================================================

    function addFoodToMeal(mealId, food, grams) {
        const calculated = calcNutrition(food, grams);
        const entry = { food, grams, calculated };
        state.meals[mealId].push(entry);
        renderMealFoods(mealId);
        recalculateAll();
        showToast(`${food.name} añadido (${grams}g)`, 'ri-add-circle-fill');
    }

    function removeFood(mealId, index) {
        const removed = state.meals[mealId][index];
        state.meals[mealId].splice(index, 1);
        renderMealFoods(mealId);
        recalculateAll();
        if (removed) {
            showToast(`${removed.food.name} eliminado`, 'ri-delete-bin-line');
        }
    }

    // ============================================================
    //  MODAL: BÚSQUEDA DE ALIMENTOS
    // ============================================================

    function openFoodSearch(mealId) {
        state.activeMeal = mealId;
        state.editingFood = null;
        searchInput.value = '';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        renderSearchResults('');
        searchInput.focus();
    }

    function closeFoodSearch() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        state.activeMeal = null;
        state.editingFood = null;
        searchInput.value = '';
    }

    // Renderiza los resultados de búsqueda o el selector de cantidad
    function renderSearchResults(query) {
        // Si hay un alimento seleccionado para cantidad, mostrar el selector
        if (state.editingFood) {
            renderQuantitySelector(state.editingFood);
            return;
        }

        const q = query.toLowerCase().trim();

        if (!q) {
            searchResults.innerHTML = `<p class="search-hint">Empieza a escribir para buscar alimentos...</p>`;
            return;
        }

        const filtered = FOOD_DATABASE.filter(f =>
            f.name.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = `<p class="search-hint">No se encontraron alimentos para "${q}"</p>`;
            return;
        }

        let html = '';
        filtered.forEach(food => {
            html += `
                <div class="food-result-item" data-food-id="${food.id}">
                    <div class="food-result-emoji">${food.emoji}</div>
                    <div class="food-result-info">
                        <span class="food-result-name">${food.name}</span>
                        <span class="food-result-nutri">${food.per100.kcal} kcal · P:${food.per100.protein}g · C:${food.per100.carbs}g · G:${food.per100.fats}g</span>
                    </div>
                    <span class="food-result-kcal">${food.per100.kcal} kcal</span>
                </div>
            `;
        });

        searchResults.innerHTML = html;

        // Click en un alimento → mostrar selector de cantidad
        searchResults.querySelectorAll('.food-result-item').forEach(el => {
            el.addEventListener('click', function () {
                const id = this.dataset.foodId;
                const food = FOOD_DATABASE.find(f => f.id === id);
                if (food) {
                    state.editingFood = food;
                    renderQuantitySelector(food);
                }
            });
        });
    }

    // Renderiza el selector de cantidad para un alimento
    function renderQuantitySelector(food) {
        const defaultGrams = 100;
        const preview = calcNutrition(food, defaultGrams);

        searchResults.innerHTML = `
            <div class="quantity-selector">
                <div class="qs-header">
                    <span class="qs-emoji">${food.emoji}</span>
                    <span class="qs-name">${food.name}</span>
                </div>
                <div class="qs-input-group">
                    <label>Cantidad:</label>
                    <input type="number" class="qs-input" value="${defaultGrams}" min="1" max="5000" step="5">
                    <span class="qs-unit">gramos</span>
                </div>
                <div class="qs-preview">
                    <span class="qs-preview-item kcal">🔥 ${preview.kcal} kcal</span>
                    <span class="qs-preview-item p">💪 ${preview.protein}g P</span>
                    <span class="qs-preview-item c">🌾 ${preview.carbs}g C</span>
                    <span class="qs-preview-item f">🧈 ${preview.fats}g G</span>
                </div>
                <div class="qs-micros">
                    <span>🌾 Fibra: ${preview.fiber}g</span>
                    <span>🧂 Sodio: ${preview.sodium}mg</span>
                    <span>🍬 Azúcar: ${preview.sugar}g</span>
                    <span>🍊 Vit. C: ${preview.vitC}mg</span>
                    <span>🩸 Hierro: ${preview.iron}mg</span>
                </div>
                <div class="qs-actions">
                    <button class="qs-btn cancel">Volver</button>
                    <button class="qs-btn add">Añadir a la comida</button>
                </div>
            </div>
        `;

        const input = searchResults.querySelector('.qs-input');
        const previewKcal = searchResults.querySelector('.qs-preview-item.kcal');
        const previewP = searchResults.querySelector('.qs-preview-item.p');
        const previewC = searchResults.querySelector('.qs-preview-item.c');
        const previewF = searchResults.querySelector('.qs-preview-item.f');
        const microsContainer = searchResults.querySelector('.qs-micros');

        // Actualizar preview en tiempo real
        function updatePreview() {
            const grams = parseFloat(input.value) || 0;
            const n = calcNutrition(food, grams);
            previewKcal.innerHTML = `🔥 ${n.kcal} kcal`;
            previewP.innerHTML = `💪 ${n.protein}g P`;
            previewC.innerHTML = `🌾 ${n.carbs}g C`;
            previewF.innerHTML = `🧈 ${n.fats}g G`;
            microsContainer.innerHTML = `
                <span>🌾 Fibra: ${n.fiber}g</span>
                <span>🧂 Sodio: ${n.sodium}mg</span>
                <span>🍬 Azúcar: ${n.sugar}g</span>
                <span>🍊 Vit. C: ${n.vitC}mg</span>
                <span>🩸 Hierro: ${n.iron}mg</span>
            `;
        }

        input.addEventListener('input', updatePreview);

        // Botón volver
        searchResults.querySelector('.qs-btn.cancel').addEventListener('click', () => {
            state.editingFood = null;
            renderSearchResults(searchInput.value);
            searchInput.focus();
        });

        // Botón añadir
        searchResults.querySelector('.qs-btn.add').addEventListener('click', () => {
            const grams = parseFloat(input.value) || 0;
            if (grams <= 0) {
                showToast('Introduce una cantidad válida', 'ri-error-warning-line');
                return;
            }
            if (state.activeMeal) {
                addFoodToMeal(state.activeMeal, food, grams);
                closeFoodSearch();
            }
        });
    }

    // ============================================================
    //  EVENT LISTENERS
    // ============================================================

    // Botones + de cada comida
    btnAddFoods.forEach(btn => {
        btn.addEventListener('click', function () {
            const meal = this.dataset.meal;
            if (meal) openFoodSearch(meal);
        });
    });

    // Cerrar modal
    btnCloseModal.addEventListener('click', closeFoodSearch);
    modal.addEventListener('click', function (e) {
        if (e.target === this) closeFoodSearch();
    });

    // Búsqueda en vivo
    searchInput.addEventListener('input', function () {
        state.editingFood = null;
        renderSearchResults(this.value);
    });

    // Botones de agua (sumar/restar según data-action, sin límite de meta)
    btnWaterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const amount = parseInt(this.dataset.amount) || 250;
            const action = this.dataset.action || 'add';
            if (action === 'add') {
                state.water.current += amount;
                showToast(`+${amount}ml de agua 💧`, 'ri-drop-fill');
            } else {
                state.water.current = Math.max(0, state.water.current - amount);
                showToast(`-${amount}ml de agua`, 'ri-drop-fill');
            }
            recalculateAll();
        });
    });

    // Navegación de días (solo visual)
    btnPrevDay.addEventListener('click', () => {
        state.currentDate.setDate(state.currentDate.getDate() - 1);
        currentDateSpan.textContent = formatDate(state.currentDate);
    });

    btnNextDay.addEventListener('click', () => {
        state.currentDate.setDate(state.currentDate.getDate() + 1);
        currentDateSpan.textContent = formatDate(state.currentDate);
    });

    // ============================================================
    //  INICIALIZAR: Render completo y fecha
    // ============================================================

    currentDateSpan.textContent = formatDate(state.currentDate);

    // Renderizar todas las comidas (vacías al inicio)
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealId => {
        renderMealFoods(mealId);
    });

    recalculateAll();

});
