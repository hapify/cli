import { CompactFieldBooleanProperty, IStorableCompactField } from '../interface/Storage';
import { IField } from '../interface/Generator';
export declare class ConverterService {
    private booleanFieldPropertiesNames;
    convertFieldToCompactFormat(field: IField): IStorableCompactField;
    convertBooleanPropertiesToCompactFormat(field: {
        [key in CompactFieldBooleanProperty]: boolean;
    }): CompactFieldBooleanProperty[];
    convertFieldFromCompactFormat(field: IStorableCompactField): IField;
}
