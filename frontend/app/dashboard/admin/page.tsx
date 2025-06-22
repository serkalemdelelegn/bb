"use client";

import { getAllEntities } from "@/app/api/apiEntities";
import { createRetailerCooperative } from "@/app/api/apiRetailerCooperatives";
import { createRetailerCooperativeShop } from "@/app/api/apiRetailerCooperativeShops";
import { createSubCity } from "@/app/api/apiSubCities";
import { createWoreda } from "@/app/api/apiWoreda";
import { signUpUser } from "@/app/api/auth/auth";
import { createCustomer } from "@/app/api/apiCustomers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function EntityManagement() {
  const { t } = useTranslation();
  const token = localStorage.getItem("token") || "";

  const { data: entitiesData, isLoading } = useQuery({
    queryKey: ["allEntities"],
    queryFn: () => getAllEntities(token),
  });

  // State for forms
  const [activeTab, setActiveTab] = useState("woredaOffice");

  // Form states for each entity
  const [woredaName, setWoredaName] = useState("");
  const [woredaSubCity, setWoredaSubCity] = useState("");

  const [subCityName, setSubCityName] = useState("");
  const [subCityEmail, setSubCityEmail] = useState("");
  const [subCityTradeBureau, setSubCityTradeBureau] = useState("");

  const [tradeBureauName, setTradeBureauName] = useState("");

  const [retailerCoopName, setRetailerCoopName] = useState("");
  const [retailerCoopWoreda, setRetailerCoopWoreda] = useState("");

  const [shopName, setShopName] = useState("");
  const [shopRetailerCoop, setShopRetailerCoop] = useState("");

  // User signup form
  const [userName, setUserName] = useState("Neima Yunus");
  const [userUsername, setUserUsername] = useState("ferid");
  const [userPassword, setUserPassword] = useState("121223");
  const [userRole, setUserRole] = useState("");
  const [userWorksAt, setUserWorksAt] = useState("");

  // Customer form states
  const [customerName, setCustomerName] = useState("");
  const [customerIDNo, setCustomerIDNo] = useState("");
  const [customerHouseNo, setCustomerHouseNo] = useState("");
  const [customerWoreda, setCustomerWoreda] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerKetena, setCustomerKetena] = useState("");
  const [customerNumberOfFamilyMembers, setCustomerNumberOfFamilyMembers] = useState(1);
  const [customerRetailerCooperativeShop, setCustomerRetailerCooperativeShop] = useState("");

  // Generate random 10-digit phone number
  const generatePhoneNumber = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    setCustomerPhone(randomNumber.toString());
  };

  // Generate random house number (e.g., 3 digit number)
  const generateHouseNumber = () => {
    const randomHouseNo = Math.floor(100 + Math.random() * 900).toString();
    setCustomerHouseNo(randomHouseNo);
  };

  // Generate random ID number (e.g., 8 digit number)
  const generateIDNumber = () => {
    const randomID = Math.floor(10000000 + Math.random() * 90000000).toString();
    setCustomerIDNo(randomID);
  };

  // Generate fake name from predefined lists
  const generateFakeName = () => {
    const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Jessica", "Daniel", "Laura"];
    const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    setCustomerName(`${randomFirstName} ${randomLastName}`);
  };

  // Handlers for form submissions (to be implemented)
  const handleWoredaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const woredaData = {
      name: woredaName,
      subCityOffice: woredaSubCity,
    };

    const data = await createWoreda(token, woredaData);
    if (data.status === "success") toast.success("created woreda success");
  };

  const handleSubCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subCityData = {
      name: subCityName,
      email: subCityEmail,
      tradeBureau: subCityTradeBureau,
    };

    const data = await createSubCity(subCityData, token);
    if (data.status === "success") toast.success("created subcity success");
  };

  const handleTradeBureauSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit tradeBureau creation
  };

  const handleRetailerCoopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const retailerCoopData = {
      name: retailerCoopName,
      woredaOffice: retailerCoopWoreda,
    };

    const data = await createRetailerCooperative(retailerCoopData, token);
    if (data.status === "success") toast.success("created coop success");
  };

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const shopData = {
      name: shopName,
      retailerCooperative: shopRetailerCoop,
    };

    const data = await createRetailerCooperativeShop(shopData, token);
    if (data.status === "success") toast.success("created coop shop success");
  };

  const handleUserSignupSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: userName,
      username: userUsername,
      password: userPassword,
      role: userRole,
      worksAt: userWorksAt,
      };
    const data = await signUpUser(userData);
    if (data.status === "success") toast.success("created user success");
    
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerData = {
      name: customerName,
      ID_No: customerIDNo,
      house_no: customerHouseNo,
      woreda: customerWoreda,
      phone: customerPhone,
      ketena: customerKetena,
      numberOfFamilyMembers: customerNumberOfFamilyMembers,
      retailerCooperativeShop: customerRetailerCooperativeShop,
    };
    const data = await createCustomer(token, customerData);
    if (data.status === "success") {
      toast.success("created customer success");
      // Reset form
      setCustomerName("");
      setCustomerIDNo("");
      setCustomerHouseNo("");
      setCustomerWoreda("");
      setCustomerPhone("");
      setCustomerKetena("");
      setCustomerNumberOfFamilyMembers(1);
      setCustomerRetailerCooperativeShop("");
    } else {
      toast.error("failed to create customer");
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="woredaOffice">{t("Woreda Office")}</TabsTrigger>
          <TabsTrigger value="subCityOffice">
            {t("Sub City Office")}
          </TabsTrigger>
          <TabsTrigger value="tradeBureau">{t("Trade Bureau")}</TabsTrigger>
          <TabsTrigger value="retailerCooperative">
            {t("Retailer Cooperative")}
          </TabsTrigger>
          <TabsTrigger value="retailerCooperativeShop">
            {t("Retailer Cooperative Shop")}
          </TabsTrigger>
          <TabsTrigger value="userSignup">{t("User Signup")}</TabsTrigger>
          <TabsTrigger value="customer">{t("Customer")}</TabsTrigger>
        </TabsList>

        <TabsContent value="woredaOffice">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Woreda Office")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWoredaSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="woredaName">{t("Name")}</Label>
                  <Input
                    id="woredaName"
                    value={woredaName}
                    onChange={(e) => setWoredaName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="woredaSubCity">{t("Sub City Office")}</Label>
                  <Select
                    onValueChange={setWoredaSubCity}
                    value={woredaSubCity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Sub City Office")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled value="loading">
                          {t("Loading...")}
                        </SelectItem>
                      ) : (
                        entitiesData?.data.subcities.map((subcity: any) => (
                          <SelectItem key={subcity._id} value={subcity._id}>
                            {subcity.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subCityOffice">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Sub City Office")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubCitySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subCityName">{t("Name")}</Label>
                  <Input
                    id="subCityName"
                    value={subCityName}
                    onChange={(e) => setSubCityName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subCityEmail">{t("Email")}</Label>
                  <Input
                    id="subCityEmail"
                    type="email"
                    value={subCityEmail}
                    onChange={(e) => setSubCityEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subCityTradeBureau">
                    {t("Trade Bureau")}
                  </Label>
                  <Select
                    onValueChange={setSubCityTradeBureau}
                    value={subCityTradeBureau}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Trade Bureau")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled value={""}>
                          {t("Loading...")}
                        </SelectItem>
                      ) : (
                        entitiesData?.data.tradeBureaus.map((tb: any) => (
                          <SelectItem key={tb._id} value={tb._id}>
                            {tb.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tradeBureau">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Trade Bureau")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTradeBureauSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tradeBureauName">{t("Name")}</Label>
                  <Input
                    id="tradeBureauName"
                    value={tradeBureauName}
                    onChange={(e) => setTradeBureauName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retailerCooperative">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Retailer Cooperative")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRetailerCoopSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="retailerCoopName">{t("Name")}</Label>
                  <Input
                    id="retailerCoopName"
                    value={retailerCoopName}
                    onChange={(e) => setRetailerCoopName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="retailerCoopWoreda">
                    {t("Woreda Office")}
                  </Label>
                  <Select
                    onValueChange={setRetailerCoopWoreda}
                    value={retailerCoopWoreda}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Woreda Office")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled value={"loading"}>
                          {t("Loading...")}
                        </SelectItem>
                      ) : (
                        entitiesData?.data.woredas.map((woreda: any) => (
                          <SelectItem key={woreda._id} value={woreda._id}>
                            {woreda.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retailerCooperativeShop">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Retailer Cooperative Shop")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShopSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="shopName">{t("Name")}</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shopRetailerCoop">
                    {t("Retailer Cooperative")}
                  </Label>
                  <Select
                    onValueChange={setShopRetailerCoop}
                    value={shopRetailerCoop}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Select Retailer Cooperative")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled value={"loading"}>
                          {t("Loading...")}
                        </SelectItem>
                      ) : (
                        entitiesData?.data.retailerCooperatives.map(
                          (coop: any) => (
                            <SelectItem key={coop._id} value={coop._id}>
                              {coop.name}
                            </SelectItem>
                          )
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="userSignup">
          <Card>
            <CardHeader>
              <CardTitle>{t("User Signup")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSignupSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userName">{t("Name")}</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userUsername">{t("Username")}</Label>
                  <Input
                    id="userUsername"
                    value={userUsername}
                    onChange={(e) => setUserUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userPassword">{t("Password")}</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">{t("User Role")}</Label>
                  <Select onValueChange={setUserRole} value={userRole}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select User Role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="682ce1ab1b2085a01b5b0b42">
                        TradeBureau
                      </SelectItem>
                      <SelectItem value="682ce1ab1b2085a01b5b0b41">
                        SubCityOffice
                      </SelectItem>
                      <SelectItem value="682ce1ab1b2085a01b5b0b40">
                        WoredaOffice
                      </SelectItem>
                      <SelectItem value="682ce1ab1b2085a01b5b0b3f">
                        RetailerCooperative
                      </SelectItem>
                      <SelectItem value="682ce1ab1b2085a01b5b0b3e">
                        RetailerCooperativeShop
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="userWorksAt">{t("Works At")}</Label>
                  <Select
                    onValueChange={setUserWorksAt}
                    value={userWorksAt}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Entity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoading && (
                        <>
                          {entitiesData?.data.tradeBureaus.map((tb: any) => (
                            <SelectItem key={tb._id} value={tb._id}>
                              {tb.name} (Trade Bureau)
                            </SelectItem>
                          ))}
                          {entitiesData?.data.subcities.map((sc: any) => (
                            <SelectItem key={sc._id} value={sc._id}>
                              {sc.name} (Sub City Office)
                            </SelectItem>
                          ))}
                          {entitiesData?.data.woredas.map((w: any) => (
                            <SelectItem key={w._id} value={w._id}>
                              {w.name} (Woreda Office)
                            </SelectItem>
                          ))}
                          {entitiesData?.data.retailerCooperatives.map(
                            (rc: any) => (
                              <SelectItem key={rc._id} value={rc._id}>
                                {rc.name} (Retailer Cooperative)
                              </SelectItem>
                            )
                          )}
                          {entitiesData?.data.retailerCooperativeShops.map(
                            (rcs: any) => (
                              <SelectItem key={rcs._id} value={rcs._id}>
                                {rcs.name} (Retailer Cooperative Shop)
                              </SelectItem>
                            )
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Sign Up")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>{t("Create Customer")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customerName">{t("Name")}</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <Button type="button" onClick={generateFakeName} className="mt-2">
                    {t("Generate Fake Name")}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="customerIDNo">{t("ID Number")}</Label>
                  <Input
                    id="customerIDNo"
                    value={customerIDNo}
                    onChange={(e) => setCustomerIDNo(e.target.value)}
                    required
                  />
                  <Button type="button" onClick={generateIDNumber} className="mt-2">
                    {t("Generate ID Number")}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="customerHouseNo">{t("House Number")}</Label>
                  <Input
                    id="customerHouseNo"
                    value={customerHouseNo}
                    onChange={(e) => setCustomerHouseNo(e.target.value)}
                  />
                  <Button type="button" onClick={generateHouseNumber} className="mt-2">
                    {t("Generate House Number")}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="customerWoreda">{t("Woreda")}</Label>
                  <Input
                    id="customerWoreda"
                    value={customerWoreda}
                    onChange={(e) => setCustomerWoreda(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">{t("Phone")}</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    readOnly
                  />
                  <Button type="button" onClick={generatePhoneNumber} className="mt-2">
                    {t("Generate Phone Number")}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="customerKetena">{t("Ketena")}</Label>
                  <Input
                    id="customerKetena"
                    value={customerKetena}
                    onChange={(e) => setCustomerKetena(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerNumberOfFamilyMembers">{t("Number of Family Members")}</Label>
                  <Input
                    id="customerNumberOfFamilyMembers"
                    type="number"
                    min={1}
                    value={customerNumberOfFamilyMembers}
                    onChange={(e) => setCustomerNumberOfFamilyMembers(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerRetailerCooperativeShop">{t("Retailer Cooperative Shop")}</Label>
                  <Select
                    onValueChange={setCustomerRetailerCooperativeShop}
                    value={customerRetailerCooperativeShop}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Retailer Cooperative Shop")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled value="loading">
                          {t("Loading...")}
                        </SelectItem>
                      ) : (
                        entitiesData?.data.retailerCooperativeShops.map((shop: any) => (
                          <SelectItem key={shop._id} value={shop._id}>
                            {shop.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{t("Create")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
