function carbonSaved(item) {
  const co2PerKg = 2.5;
  return (item.weight_kg * 2.5).toFixed(2);
}

export { carbonSaved };
