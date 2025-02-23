export type UUID = string;
export type JSONString = string;
export type ImageUrl = string;
export type PropertyName = string;
export type SignedUrl = string;
export type Base64ImageData = string;
export type JexlExpression = string;

// Aliases for Model IDs
export type BatchId = UUID;
export type AppEntityId = UUID;
export type LobbySessionId = UUID;
export type GameSessionId = UUID;
export type GameId = UUID;
export type PlayerId = UUID;

export type EmailAddress = string;
export type HexColor = string; // Such as '#000000', '#FF0000', '#0000FF', etc.
export type BasicPenColor = string; // Such as 'black', 'red', 'blue', etc.
export type StrokeColor = HexColor | BasicPenColor;

// The resource name that points to a file in Firebase Storage
export type FirebaseResourceName = string;

export type TimestampInMilliseconds = number;
export type TimeInMilliseconds = number;
export type TimeInSeconds = number;
