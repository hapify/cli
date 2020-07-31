export declare class FieldType {
    static Boolean: string;
    static Number: string;
    static String: string;
    static DateTime: string;
    static Entity: string;
    static Object: string;
    static File: string;
}
export declare class FieldSubType {
    static Boolean: {};
    static Number: {
        Integer: string;
        Float: string;
        Latitude: string;
        Longitude: string;
    };
    static String: {
        Email: string;
        Password: string;
        Url: string;
        Text: string;
        RichText: string;
    };
    static DateTime: {
        Date: string;
        Time: string;
    };
    static Entity: {};
    static Object: {};
    static File: {
        Image: string;
        Video: string;
        Audio: string;
        Document: string;
    };
}
