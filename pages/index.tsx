/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import BlogPreview from "../components/BlogPreview";
import { getBlogs } from "../server/blogs";
import styles from "../styles/Home.module.css";
import { BlogPost } from "../types/blog";

const Home: NextPage = ({ blogData, tags }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [filterWord, setFilterWord] = React.useState<string[]>([]);
    const [selectedIdx, setSelectedIdx] = React.useState<number[]>([]);
    const filteredBlog: BlogPost[] = React.useMemo(() => {
        return filterWord.length > 0
            ? blogData.filter((blog: BlogPost) => {
                  return filterWord.every((filter) => blog.tags.includes(filter));
              })
            : blogData;
    }, [filterWord]);

    const filterLabel = (tag: any, idx: number) => {
        if (selectedIdx.includes(idx)) {
            setSelectedIdx(selectedIdx.filter((id) => id !== idx));
            setFilterWord(filterWord.filter((filter) => filter !== tag.innerText));
        } else {
            setSelectedIdx([...selectedIdx, idx]);
            setFilterWord([...filterWord, tag.innerText]);
        }
    };

    React.useEffect(() => {
        console.log(selectedIdx);
    }, [selectedIdx]);
    return (
        <main className='layout'>
            <title>Home Page</title>
            <section>
                <div className='mt-3 text-center'>
                    <h1 className='text-[3rem]'>Welcome to DevBlog</h1>
                    <p>A fullstack blog make with Next.js, TailwindCss, Github GraphQL</p>
                </div>
            </section>
            <section className='flex flex-col items-center text-[1.15rem] mt-12'>
                <div className='flex gap-3 mb-12'>
                    {tags.map((tag: string, idx: number) => {
                        return (
                            <button
                                className={`${
                                    selectedIdx.includes(idx)
                                        ? "label-selected hover:bg-sky-400 transition-all duration-300"
                                        : "label hover:bg-sky-400 transition-all duration-300"
                                } `}
                                key={idx}
                                onClick={(e) => filterLabel(e.target, idx)}>
                                {tag}
                            </button>
                        );
                    })}{" "}
                </div>
                {filteredBlog.map((blog: BlogPost) => {
                    return (
                        <div
                            key={blog.id}
                            className='max-w-[28em] overflow-hidden mx-6 mb-6 bg-neutral-300 text-zinc-800 rounded-lg p-4 hover:bg-neutral-500 hover:text-neutral-300 transition-all duration-300'>
                            <a href={blog.url} target='_blank' rel='noreferrer'>
                                <BlogPreview
                                    title={blog.title}
                                    bodyText={blog.bodyText}
                                    createdAt={blog.createdAt}
                                    author={blog.author}
                                    tags={blog.tags}></BlogPreview>
                            </a>
                        </div>
                    );
                })}
            </section>
        </main>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
    let blogs: BlogPost[] = await getBlogs();
    let tags: string[] = [];
    for (const blog of blogs) {
        for (const tag of blog.tags) {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
    }

    return {
        props: {
            blogData: blogs,
            tags: tags,
        },
    };
};
