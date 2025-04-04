import { computed, ref } from 'vue'

export function useValidation(schema, data) {
  const errors = ref({})

  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  const validateData = () => {
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      error.details.forEach((e) => {
        setDepthValue(0, e.path, e.message, errors.value)
      })
    }
  }

  // private methods
  const checkIfKeyExists = (key, obj) => {
    return obj ? Object.keys(obj).includes(key) : false
  }

  const checkIsKeyArray = (ndx, path) => {
    const max = path.length - 1
    const nextKeyNdx = ndx + 1

    return nextKeyNdx < max && typeof path[nextKeyNdx] === 'number'
  }

  const setDepthValue = (ndx, path, value, errWrapper) => {
    if (ndx === path.length - 1) {
      errWrapper[path[ndx]] = value
    } else {
      if (typeof path[ndx] == 'number') {
        if (errWrapper[path[ndx]] === undefined) {
          errWrapper[path[ndx]] = checkIsKeyArray(ndx, path) ? [] : {}
        }
      } else {
        if (!checkIfKeyExists(path[ndx], errWrapper)) {
          errWrapper[path[ndx]] = checkIsKeyArray(ndx, path) ? [] : {}
        }
      }

      setDepthValue(ndx + 1, path, value, errWrapper[path[ndx]])
    }
  }

  return {
    errors,
    hasErrors,
    validateData
  }
}
