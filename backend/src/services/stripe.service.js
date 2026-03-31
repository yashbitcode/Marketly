import { Stripe } from "stripe";
import { COMMISSION_RATE, FRONTEND_URL } from "../../../shared/constants.js";

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createConnectedAccount(vendor, detailsPayload) {
        const { email, businessCategory, businessSize } = detailsPayload;
        const {
            vendorType,
            storeName,
            fullname,
            phoneNumber,
            _id: vendorId,
        } = vendor;

         const account = await this.stripe.accounts.create({
        type: "express",
        country: "us",
        email: email,
        business_type: "individual",

        // Request minimal capabilities
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },

        // Business profile (required for Express accounts)
        business_profile: {
          product_description: "Online marketplace sales",
          mcc: "5699", // Miscellaneous specialty retail
        },

        // KEY: Set manual payouts until full onboarding complete
        settings: {
          payouts: {
            schedule: {
              interval: "manual", // Prevents automatic payouts
            },
          },
        },

        // Minimal individual info (optional but helpful)
        // ...(firstName &&
        //   lastName && {
        //     individual: {
        //       first_name: firstName,
        //       last_name: lastName,
        //       email: email,
        //       address: {
        //         country: country,
        //       },
        //     },
        //   }),

        // Metadata for tracking
        metadata: {
          onboarding_type: "deferred",
        //   platform_user_id: userId,
        },
      });

        // const account = await this.stripe.v2.core.accounts.create({
        //     contact_email: email,
        //     contact_phone: phoneNumber,
        //     display_name: fullname,
        //     identity: {
        //         country: "us",
        //         entity_type: vendorType === "business" ? "company" : vendorType,
        //         business_details: {
        //             registered_name: storeName,
        //         },
        //     },
        //     configuration: {
        //         merchant: {
        //             capabilities: {
        //                 card_payments: {
        //                     requested: true,
        //                 },
        //             },
        //         },
        //     },
        //     defaults: {
        //         currency: "usd",
        //         responsibilities: {
        //             fees_collector: "stripe",
        //             losses_collector: "stripe",
        //         },
        //     },
        //     dashboard: "full",
        //     // include: ["configuration.merchant", "identity", "defaults"],
        //     metadata: {
        //         vendor_id: vendorId,
        //         commission_rate: COMMISSION_RATE + "%",
        //         business_category: businessCategory,
        //         business_size: businessSize,
        //     },
        // });

        return account;
    }

    async getOnboardingLink(accountId) {

        const accountLink =  await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${FRONTEND_URL}/dashboard?onboarding=refresh`,
      return_url: `${FRONTEND_URL}/dashboard?onboarding=complete`,
      type: "account_onboarding",
    });

        
        
        // await this.stripe.v2.core.accountLinks.create({
        //     account: accountId,
        //     use_case: {
        //         type: "account_onboarding",
        //         account_onboarding: {
        //             configurations: ["merchant"],
        //             refresh_url: FRONTEND_URL,
        //             return_url: FRONTEND_URL + "/success",
        //         },
        //     },
        // });

        return accountLink.url;
    }

    async makePaymentTransfer(vendorPayoutId, amount, accountId) {
        const transfer = await this.stripe.transfers.create({
            amount: Math.floor((amount * 100) / 83),
            currency: "usd",
            destination: accountId,
            description: `Adding funds to ${accountId} account`,
            metadata: {
                vendorPayoutId,
            },
        });

        return transfer;
    }

    async makePayout(vendorPayoutId, amount, accountId) {
        const payout = await this.stripe.payouts.create(
            {
                amount: Math.floor((amount * 100) / 83),
                currency: "usd",
                method: "standard",
                description: "Payout sent",
                metadata: {
                    vendorPayoutId,
                },
            },
            {
                stripeAccount: accountId,
            },
        );

        return payout;
    }

    async retrieveAccount(accountId) {
        const account = await this.stripe.accounts.retrieve(accountId);
        return account;
    }

    async updatePayoutSchedule(accountId) {
        const balanceSettings = await this.stripe.balanceSettings.update(
            {
                payments: {
                    payouts: {
                        schedule: {
                            interval: "manual",
                        },
                    },
                },
            },
            {
                stripeAccount: accountId,
            },
        );

        return balanceSettings;
    }
}

export default new StripeService();
