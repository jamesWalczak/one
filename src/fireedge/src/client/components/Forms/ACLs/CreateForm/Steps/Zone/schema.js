/* ------------------------------------------------------------------------- *
 * Copyright 2002-2023, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { INPUT_TYPES, T, FEDERATION_TYPE } from 'client/constants'
import { Field, getObjectSchemaFromFields, arrayToOptions } from 'client/utils'
import { string } from 'yup'
import { ZonesTable } from 'client/components/Tables'

const ACL_TYPE_ZONE_TRANSLATIONS = {
  ALL: { value: 'ALL', text: T.All },
  INDIVIDUAL: { value: 'INDIVIDUAL', text: T.Zone },
}

/** @type {Field} Type field */
export const TYPE = (oneConfig) => ({
  name: 'TYPE',
  type: INPUT_TYPES.TOGGLE,
  values: () =>
    arrayToOptions(Object.keys(ACL_TYPE_ZONE_TRANSLATIONS), {
      addEmpty: false,
      getText: (key) => ACL_TYPE_ZONE_TRANSLATIONS[key].text,
      getValue: (key) => ACL_TYPE_ZONE_TRANSLATIONS[key].value,
    }),
  validation:
    oneConfig.FEDERATION.MODE === FEDERATION_TYPE.STANDALONE
      ? string()
      : string().required(),
  grid: { md: 12 },
})

const ZONE = (oneConfig) => ({
  name: 'ZONE',
  label: T['acls.form.create.zone.zone'],
  type: INPUT_TYPES.TABLE,
  dependOf: TYPE(oneConfig).name,
  htmlType: (type) =>
    (!type || type !== ACL_TYPE_ZONE_TRANSLATIONS.INDIVIDUAL.value) &&
    INPUT_TYPES.HIDDEN,
  Table: () => ZonesTable,
  validation: string()
    .trim()
    .when(TYPE(oneConfig).name, (type, schema) =>
      type !== ACL_TYPE_ZONE_TRANSLATIONS.INDIVIDUAL.value
        ? schema.strip()
        : schema.required()
    )
    .default(() => undefined),
  grid: { md: 12 },
})

/**
 * Return all the fields for this schema.
 *
 * @param {object} oneConfig - . ONE config
 * @returns {Array} - The list of fields
 */
const FIELDS = (oneConfig) => {
  console.log(oneConfig)

  return [TYPE(oneConfig), ZONE(oneConfig)]
}

/**
 * Return the schema.
 *
 * @param {object} oneConfig - . ONE config
 * @returns {object} - The schema
 */
const SCHEMA = (oneConfig) => {
  console.log(oneConfig)

  return getObjectSchemaFromFields(FIELDS(oneConfig))
}

export { SCHEMA, FIELDS }
