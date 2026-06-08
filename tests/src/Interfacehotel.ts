interface hotel {
    name: string;
    location: string;
    rating: number;
    veganFriendly: boolean;

   prepareTomatoSoup(): Promise<void>;

}

