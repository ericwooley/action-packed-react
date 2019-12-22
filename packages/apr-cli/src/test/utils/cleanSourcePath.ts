import { join } from "path";

const projectRootPath = new RegExp(join(__dirname, "../../../../../"), 'g')
export const cleanSourcePath = (str: string) => str.replace(projectRootPath, '<project-root>')
