// shuffleAndLimit.js

/**
 * Shuffles an array and selects a limited number of elements divided among categories,
 * ensuring the most equal distribution possible.
 *
 * @param {Object} categoryMap - An object where keys are categories and values are arrays of items.
 * @param {number} limit - The total number of elements to return.
 * @returns {Array} - The shuffled and limited array with elements evenly distributed across categories.
 */
const shuffleAndLimit = (categoryMap, limit) => {
  console.log("Input categoryMap:", categoryMap);
  console.log("Limit:", limit);

  if (typeof categoryMap !== "object" || categoryMap === null) {
    console.error("Provided value is not a valid category map:", categoryMap);
    return [];
  }

  const categories = Object.keys(categoryMap);
  console.log("Categories:", categories);

  const totalCategories = categories.length;

  if (totalCategories === 0) {
    console.warn("No categories found in the category map.");
    return [];
  }

  // Calculate base items per category and remaining slots
  const itemsPerCategory = Math.floor(limit / totalCategories);
  let remainingSlots = limit % totalCategories;

  console.log("Items per category:", itemsPerCategory);
  console.log("Remaining slots:", remainingSlots);

  const result = [];

  categories.forEach((category) => {
    const items = categoryMap[category];

    if (!Array.isArray(items)) {
      console.warn(`Skipping category '${category}' as its value is not an array.`);
      return;
    }

    console.log(`Shuffling items for category '${category}':`, items);

    // Shuffle the items in the category
    const shuffledItems = items.sort(() => 0.5 - Math.random());

    // Allocate the base number of items per category
    result.push(...shuffledItems.slice(0, itemsPerCategory));

    // Allocate one extra item if there are remaining slots
    if (remainingSlots > 0 && shuffledItems.length > itemsPerCategory) {
      result.push(shuffledItems[itemsPerCategory]);
      remainingSlots -= 1;
    }
  });

  console.log("Final result before shuffle:", result);

  // Shuffle the final result array
  const finalShuffledResult = result.sort(() => 0.5 - Math.random());

  console.log("Final shuffled result:", finalShuffledResult);

  return finalShuffledResult;
};

export default shuffleAndLimit;
