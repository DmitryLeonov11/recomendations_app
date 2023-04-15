﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Recomendations_app.Data;
using Recomendations_app.Models;

namespace Recomendations_app.Controllers
{
    public class ReviewController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        public ActionResult Index(string query)
        {
            var result = new List<ReviewModel>();
            if (!query.IsNullOrEmpty())
            {
                query = query.Trim();
                query = query.Replace(" ", " <-> ");
                result = _context.Reviews.Where(x =>
                    x.SearchVector.Matches(EF.Functions.ToTsQuery($"{query}:*"))
                ).ToList();
            }
            return View(result);
        }

        // GET: Review/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null || _context.Reviews == null)
            {
                return NotFound();
            }

            var reviewModel = await _context.Reviews
                //.Include(r => r.Author)
                //.Include(r => r.Subject)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (reviewModel == null)
            {
                return NotFound();
            }

            return View(reviewModel);
        }

        // GET: Review/Create
        public IActionResult Create()
        {
            ViewData["SubjectId"] = new SelectList(_context.Subjects, "Id", "Name");
            return View();
        }

        // POST: Review/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,ReviewCategory,AuthorGrade,ReviewBody,DateOfCreationInUTC,ReviewImageId,ImageLink,AuthorName")] ReviewModel reviewModel)
        {
            reviewModel.Id = Guid.NewGuid().ToString();
            reviewModel.AuthorName = this.User.Identity.Name;
            reviewModel.DateOfCreationInUTC = DateTime.UtcNow;
            if (!ModelState.IsValid)
            {
                _context.Add(reviewModel);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index","Home");
            }
            //ViewData["SubjectId"] = new SelectList(_context.Subjects, "Id", "Name", reviewModel.SubjectId);
            return View(reviewModel);
        }

        // GET: Review/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null || _context.Reviews == null)
            {
                return NotFound();
            }

            var reviewModel = await _context.Reviews.FindAsync(id);
            if (reviewModel == null)
            {
                return NotFound();
            }
            ViewData["AuthorName"] = new SelectList(_context.Set<UserModel>(), "Id", "Id", reviewModel.AuthorName);
            //ViewData["SubjectId"] = new SelectList(_context.Subjects, "Id", "Name", reviewModel.SubjectId);
            return View(reviewModel);
        }

        // POST: Review/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Id,Title,ReviewCategory,AuthorGrade,ReviewBody,DateOfCreationInUTC,SubjectId,ReviewImageId,ImageLink,AuthorName")] ReviewModel reviewModel)
        {
            if (id != reviewModel.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(reviewModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ReviewModelExists(reviewModel.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index","Home");
            }
            ViewData["AuthorName"] = new SelectList(_context.Set<UserModel>(), "Id", "Id", reviewModel.AuthorName);
            //ViewData["SubjectId"] = new SelectList(_context.Subjects, "Id", "Name", reviewModel.SubjectId);
            return View(reviewModel);
        }

        // GET: Review/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null || _context.Reviews == null)
            {
                return NotFound();
            }

            var reviewModel = await _context.Reviews
                //.Include(r => r.Author)
                //.Include(r => r.Subject)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (reviewModel == null)
            {
                return NotFound();
            }

            return View(reviewModel);
        }

        // POST: Review/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (_context.Reviews == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Reviews'  is null.");
            }
            var reviewModel = await _context.Reviews.FindAsync(id);
            if (reviewModel != null)
            {
                _context.Reviews.Remove(reviewModel);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Home");
        }

        private bool ReviewModelExists(string id)
        {
          return (_context.Reviews?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
