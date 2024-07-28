"use client";

import { useState } from "react";
import { fetchGuestAccessToken } from "@/services/browser/AuthService";
import { searchProducts } from "@/services/browser/SearchService";

export default function TestPage() {
  const [accessObject, setAccessObject] = useState<Record<string, string>>({
    accessToken: "",
    sessionId: "",
  });
  const [productData, setProductData] = useState<number>(0);

  const handleGuestLogin = async () => {
    try {
      const response = await fetchGuestAccessToken();
      console.log("response", response);
      if (response?.accessToken && response?.sessionId) {
        setAccessObject(response);
      }
    } catch (error) {
      console.error("Error fetching guest access token:", error);
    }
  };

  const handleProductSearch = async () => {
    if (!accessObject.sessionId) {
      console.error("Session Id not found");
      return;
    }

    try {
      const searchModel = await searchProducts("dress", accessObject.sessionId);
      if (searchModel) {
        setProductData(Number(searchModel.total));
      }
    } catch (error) {
      console.error("Error searching product:", error);
    }
  };

  return (
    <>
      <button onClick={handleGuestLogin}>Fetch Access Token</button>
      {!!accessObject.accessToken && (
        <p className="text-wrap">
          NextJS Session Id : {accessObject.sessionId}
        </p>
      )}

      {!!accessObject.accessToken && !!accessObject.sessionId && (
        <>
          <button onClick={handleProductSearch}>Search Products</button>
          {!!productData && (
            <p className="text-wrap">Products Count : {productData}</p>
          )}
        </>
      )}
    </>
  );
}
