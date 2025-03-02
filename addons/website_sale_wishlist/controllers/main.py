# -*- coding: utf-8 -*-

import json

from odoo.http import request, route
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleWishlist(WebsiteSale):

    @route(['/shop/wishlist/add'], type='json', auth="public", website=True)
    def add_to_wishlist(self, product_id, **kw):
        website = request.website
        pricelist = website.pricelist_id
        product = request.env['product.product'].browse(product_id)

        price = product._get_combination_info_variant(pricelist=website.pricelist_id)['price']

        Wishlist = request.env['product.wishlist']
        if request.website.is_public_user():
            Wishlist = Wishlist.sudo()
            partner_id = False
        else:
            partner_id = request.env.user.partner_id.id

        wish = Wishlist._add_to_wishlist(
            pricelist.id,
            pricelist.currency_id.id,
            request.website.id,
            price,
            product_id,
            partner_id
        )

        if not partner_id:
            request.session['wishlist_ids'] = request.session.get('wishlist_ids', []) + [wish.id]

        return wish

    @route(['/shop/wishlist'], type='http', auth="public", website=True, sitemap=False)
    def get_wishlist(self, count=False, **kw):
        values = request.env['product.wishlist'].with_context(display_default_code=False).current()
        if count:
            return request.make_response(json.dumps(values.mapped('product_id').ids))

        if not len(values):
            return request.redirect("/shop")

        return request.render("website_sale_wishlist.product_wishlist", dict(wishes=values))

    @route(['/shop/wishlist/remove/<model("product.wishlist"):wish>'], type='json', auth="public", website=True)
    def rm_from_wishlist(self, wish, **kw):
        if request.website.is_public_user():
            wish_ids = request.session.get('wishlist_ids') or []
            if wish.id in wish_ids:
                request.session['wishlist_ids'].remove(wish.id)
                request.session.modified = True
                wish.sudo().unlink()
        else:
            wish.unlink()
        return True
