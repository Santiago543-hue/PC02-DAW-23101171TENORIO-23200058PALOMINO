<script setup>
import { computed, onMounted, ref } from 'vue'
import itemService from '../services/itemService'

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const editingId = ref(null)
const form = ref({
  name: '',
  description: '',
})

const isEditing = computed(() => editingId.value !== null)

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback
}

async function loadItems() {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await itemService.getAll()
    if (!Array.isArray(result)) {
      throw new Error('La respuesta del servidor no contiene una lista de elementos.')
    }
    items.value = result
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'No se pudieron cargar los elementos.')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = { name: '', description: '' }
  editingId.value = null
  errorMessage.value = ''
}

function startEditing(item) {
  const id = item.id ?? item._id
  if (id === undefined || id === null) {
    errorMessage.value = 'No se puede editar un elemento sin identificador.'
    return
  }

  editingId.value = id
  form.value = {
    name: item.name ?? '',
    description: item.description ?? '',
  }
  errorMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submitForm() {
  saving.value = true
  errorMessage.value = ''

  try {
    const data = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
    }

    if (isEditing.value) {
      await itemService.update(editingId.value, data)
    } else {
      await itemService.create(data)
    }

    resetForm()
    await loadItems()
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'No se pudo guardar el elemento.')
  } finally {
    saving.value = false
  }
}

async function deleteItem(item) {
  const id = item.id ?? item._id
  if (id === undefined || id === null) {
    errorMessage.value = 'No se puede eliminar un elemento sin identificador.'
    return
  }

  if (!window.confirm(`¿Eliminar "${item.name || 'este elemento'}"?`)) return

  errorMessage.value = ''
  try {
    await itemService.remove(id)
    if (editingId.value === id) resetForm()
    await loadItems()
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'No se pudo eliminar el elemento.')
  }
}

onMounted(loadItems)
</script>

<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">GESTIÓN DE DATOS</p>
      <h1>Elementos</h1>
      <p class="page-heading__description">Crea, consulta y administra tus elementos.</p>
    </div>
    <span class="count-badge">{{ items.length }} registros</span>
  </section>

  <section class="card form-card" aria-labelledby="form-title">
    <div class="card__heading">
      <div>
        <h2 id="form-title">{{ isEditing ? 'Editar elemento' : 'Nuevo elemento' }}</h2>
        <p>{{ isEditing ? 'Actualiza los datos del elemento.' : 'Completa los campos para agregar un registro.' }}</p>
      </div>
      <span class="section-icon" aria-hidden="true">{{ isEditing ? '✎' : '+' }}</span>
    </div>

    <form class="item-form" @submit.prevent="submitForm">
      <label class="field">
        <span>Nombre</span>
        <input
          v-model="form.name"
          type="text"
          name="name"
          placeholder="Ej. Mi elemento"
          required
        />
      </label>
      <label class="field">
        <span>Descripción</span>
        <input
          v-model="form.description"
          type="text"
          name="description"
          placeholder="Agrega una descripción"
        />
      </label>
      <div class="form-actions">
        <button class="button button--primary" type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear elemento' }}
        </button>
        <button
          v-if="isEditing"
          class="button button--secondary"
          type="button"
          @click="resetForm"
        >
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="alert" role="alert">{{ errorMessage }}</p>
  </section>

  <section class="card list-card" aria-labelledby="list-title">
    <div class="card__heading">
      <div>
        <h2 id="list-title">Listado</h2>
        <p>Registros disponibles en el sistema.</p>
      </div>
      <button class="button button--secondary button--compact" type="button" :disabled="loading" @click="loadItems">
        {{ loading ? 'Cargando…' : 'Actualizar' }}
      </button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th class="actions-heading">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id ?? item._id">
            <td class="item-name">{{ item.name || 'Sin nombre' }}</td>
            <td class="muted-cell">{{ item.description || '—' }}</td>
            <td>
              <div class="row-actions">
                <button class="text-button" type="button" @click="startEditing(item)">Editar</button>
                <button class="text-button text-button--danger" type="button" @click="deleteItem(item)">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && items.length === 0">
            <td class="empty-state" colspan="3">Todavía no hay elementos. Crea el primero usando el formulario.</td>
          </tr>
          <tr v-if="loading && items.length === 0">
            <td class="empty-state" colspan="3">Cargando elementos…</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
