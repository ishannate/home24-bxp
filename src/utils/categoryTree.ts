export interface Category {
  id: number
  name: string
  parentId?: number
  children?: Category[]
}

export const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<number, Category & { children: Category[] }>()
  const roots: Category[] = []

  categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }))

  categories.forEach((cat) => {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(map.get(cat.id)!)
    } else {
      roots.push(map.get(cat.id)!)
    }
  })

  return roots
}

export const findCategoryById = (categories: Category[], id: number): Category | undefined => {
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children) {
      const result = findCategoryById(cat.children, id)
      if (result) return result
    }
  }
  return undefined
}