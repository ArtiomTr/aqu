import { readdir } from 'fs-extra';

import { templatesPath } from '../constants';

export const getAllTemplates = () =>
	readdir(templatesPath).then((files) => files.filter((template) => template.charAt(0) !== '_'));
