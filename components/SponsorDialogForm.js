"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "./ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addSponsor, updateSponsorByID } from "@/lib/actions/sponsorActions";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  company: z.string().min(1).nullable(),
  businessPhoneNumber: z.string().nullable(),
  address1: z.string().min(1).nullable(),
  address2: z.string().nullable(),
  city: z.string().min(1).nullable(),
  state: z.string().min(2).max(2).nullable(),
  zip: z.string().min(5).nullable(),
  solicitor: z.string().nullable(),
  contactPrefix: z.string().nullable(),
  contactFirstName: z.string().min(1).nullable(),
  contactLastName: z.string().min(1).nullable(),
  contactPhoneNumber: z.string().min(10).nullable(),
  contactEmail: z.string().email().nullable(),
});

const SponsorDialogForm = ({
  isFormOpen,
  formHandler,
  sponsor = null,
  committeeMembers,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [user, setUser] = useState({});

  const getUser = async () => {
    const { data: profile } = await supabase
      .from("Profiles")
      .select("user_id, first_name, last_name,role");

    setUser(profile[0]);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    getUser();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      businessPhoneNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      solicitor: "",
      contactPrefix: "",
      contactFirstName: "",
      contactLastName: "",
      contactPhoneNumber: "",
      contactEmail: "",
    },
  });

  useEffect(() => {
    if (sponsor) {
      console.log("SPONSOR", sponsor);
      form.reset({
        company: sponsor.company_name,
        businessPhoneNumber: sponsor.business_phone_number,
        address1: sponsor.address1,
        address2: sponsor.address2,
        city: sponsor.city,
        state: sponsor.state,
        zip: sponsor.zip,
        solicitor: sponsor.committee_member_id,
        contactPrefix: sponsor.contact_prefix,
        contactFirstName: sponsor.contact_first_name,
        contactLastName: sponsor.contact_last_name,
        contactPhoneNumber: sponsor.contact_phone_number,
        contactEmail: sponsor.contact_email,
      });
    } else {
      form.reset({
        company: "",
        businessPhoneNumber: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        solicitor: "",
        contactPrefix: "",
        contactFirstName: "",
        contactLastName: "",
        contactPhoneNumber: "",
        contactEmail: "",
      });
    }
  }, [sponsor, isFormOpen]);

  const onSubmit = async (data) => {
    formHandler();
    //If there's an existing item, edit the item
    if (sponsor) {
      const updateData = {
        company_name: data.company,
        business_phone_number: data.businessPhoneNumber,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        committee_member_id: data.solicitor,
        contact_prefix: data.contactPrefix,
        contact_first_name: data.contactFirstName,
        contact_last_name: data.contactLastName,
        contact_phone_number: data.contactPhoneNumber,
        contact_email: data.contactEmail,
      };
      const { result, error } = await updateSponsorByID(
        sponsor.sponsor_id,
        updateData
      );
      console.log("UPDATE ERROR", error);
      console.log("UPDATE RESULT", result);

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
      } else {
        toast({
          variant: "success",
          description: result,
        });
        router.refresh();
      }
    }
    //Otherwise we are adding an item
    else {
      const newSponsorData = {
        company_name: data.company,
        business_phone_number: data.businessPhoneNumber,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        committee_member_id: data.solicitor,
        contact_prefix: data.contactPrefix,
        contact_first_name: data.contactFirstName,
        contact_last_name: data.contactLastName,
        contact_phone_number: data.contactPhoneNumber,
        contact_email: data.contactEmail,
      };

      const { result, error } = await addSponsor(newSponsorData);

      if (error) {
        toast({
          variant: "destructive",
          title: result,
          description: error,
        });
      } else {
        toast({
          variant: "success",
          description: result,
        });
        router.refresh();
      }
    }
  };

  return (
    <Dialog
      onOpenChange={formHandler}
      open={isFormOpen}
      defaultOpen={isFormOpen}
    >
      <DialogContent className="sm:max-w-[550px]">
        {loading ? (
          <Spinner size="medium" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="text-4xl pb-5">
                  {sponsor ? "Edit Sponsor" : "Add Sponsor"}
                </DialogTitle>
              </DialogHeader>

              <Card className="my-4 pt-3">
                <CardContent>
                  <div className="grid grid-cols-1">
                    <FormField
                      control={form.control}
                      name="solicitor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solicitor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    sponsor?.committee_members
                                      ? `${sponsor.committee_members.first_name} ${sponsor.committee_members.last_name}`
                                      : "Please select a committee member"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {committeeMembers.map((member) => {
                                return (
                                  <SelectItem
                                    key={member.committee_member_id}
                                    value={member.committee_member_id}
                                  >
                                    {`${member.first_name} ${member.last_name}`}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Tabs
                defaultValue="businessInfo"
                className="w-full min-h-[500px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="businessInfo">Business Info</TabsTrigger>
                  <TabsTrigger value="contactInfo">Contact Info</TabsTrigger>
                </TabsList>
                {/* START OF BUSINESS INFORMATION TAB */}
                <TabsContent value="businessInfo">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 ">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1">
                      <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address 1</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1">
                      <FormField
                        control={form.control}
                        name="address2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address 2</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-9 gap-4 ">
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 ">
                      <FormField
                        control={form.control}
                        name="businessPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                {/* END OF BUSINESS INFORMATION TAB */}

                {/* START OF CONTACT INFORMATION TAB */}
                <TabsContent value="contactInfo">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-8 gap-4  ">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="contactPrefix"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prefix</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="contactFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="contactLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 ">
                      <FormField
                        control={form.control}
                        name="contactPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 ">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                {/* END OF CONTACT INFORMATION TAB */}
              </Tabs>

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SponsorDialogForm;