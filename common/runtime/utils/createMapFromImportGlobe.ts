const getNameFromPath = (path: string, ext: string) => {
  const pathSplit = path.split("/");
  const filename = pathSplit[pathSplit.length - 1] || "";
  const localeName = filename.replace(`.${ext}`, "");

  return localeName;
};

export const createMapFromImportGlobe = (
  i: Record<string, () => Promise<Record<string, any>>>,
  ext: string,
) => {
  const localeMap = new Map<string, { loader: () => Promise<any> }>([]);

  for (const path in i) {
    const localeName = getNameFromPath(path, ext);
    localeMap.set(localeName, { loader: i[path] });
  }

  return localeMap;
};
